-- DDL Script para la tienda level Up creado por Jonathan Tubac

-- Crear las tablas con las FK de las relaciones

CREATE TABLE Proveedores(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	nombre VARCHAR(60) NOT NULL,
	activo BOOLEAN DEFAULT true
);

CREATE TABLE Categorias(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	nombre VARCHAR(60) NOT NULL
);

CREATE TABLE Roles(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Productos(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	nombre VARCHAR(60) NOT NULL,
	precio DECIMAL(10,2) CHECK (precio > 0),
	stock INT CHECK (stock >= 0),
	activo BOOL DEFAULT true,
	id_categoria INT NOT NULL -- FK de Categorias
);

CREATE TABLE Brinda(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	id_proveedor INT NOT NULL,
	id_producto INT NOT NULL,
	cantidad INT CHECK (cantidad > 0),
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Usuarios(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	correo VARCHAR(100) NOT NULL CHECK (correo LIKE '%@%.%'),
	password TEXT NOT NULL,
	telefono VARCHAR(20),
	activo BOOLEAN NOT NULL DEFAULT true,
	id_rol INT NOT NULL -- FK de Roles
);

CREATE TABLE Empleados (
  carnet INT PRIMARY KEY,
  sueldo DECIMAL(10,2) CHECK (sueldo > 0),
  id_usuario INT UNIQUE NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE Billeteras(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	monto DECIMAL(10,2) DEFAULT 0 CHECK (monto >= 0),
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id_usuario INT UNIQUE NOT NULL -- FK de Usuarios
);

CREATE TABLE Compras(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	tipo VARCHAR(60) CHECK (tipo IN ('presencial', 'en_linea')),
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	total DECIMAL(10,2) CHECK (total >= 0),
	id_usuario INT, -- FK de Usuarios
	id_empleado INT -- FK de Empleados (nullable para compras en línea)
);

CREATE TABLE DetalleCompras(
	id_producto INT NOT NULL,
	id_compra INT NOT NULL,
	cantidad_producto INT CHECK (cantidad_producto > 0),
	precio_unitario DECIMAL(10,2) CHECK (precio_unitario > 0),
	PRIMARY KEY (id_producto, id_compra)
);

CREATE TABLE Movimientos(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	tipo VARCHAR(60) CHECK (tipo IN ('recarga', 'descuento')),
	monto DECIMAL(10,2) CHECK (monto > 0),
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id_compra INT, -- nullable, solo aplica en descuentos
	id_billetera INT NOT NULL, -- FK de Billeteras
	balance_despues FLOAT NOT NULL
);

-- Agregar la llave foranea a los atributos dónde pusimos FK

ALTER TABLE Productos ADD CONSTRAINT fk_productos_categoria FOREIGN KEY (id_categoria) REFERENCES Categorias(id);
ALTER TABLE Brinda ADD CONSTRAINT fk_brinda_proveedor FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id);
ALTER TABLE Brinda ADD CONSTRAINT fk_brinda_producto FOREIGN KEY (id_producto) REFERENCES Productos(id);
ALTER TABLE Usuarios ADD CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol) REFERENCES Roles(id);
ALTER TABLE Billeteras ADD CONSTRAINT fk_billeteras_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id);
ALTER TABLE Compras ADD CONSTRAINT fk_compras_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id);
ALTER TABLE Compras ADD CONSTRAINT fk_compras_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(carnet);
ALTER TABLE DetalleCompras ADD CONSTRAINT fk_detalle_compra FOREIGN KEY (id_compra) REFERENCES Compras(id);
ALTER TABLE DetalleCompras ADD CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES Productos(id);
ALTER TABLE Movimientos ADD CONSTRAINT fk_movimientos_compra FOREIGN KEY (id_compra) REFERENCES Compras(id);
ALTER TABLE Movimientos ADD CONSTRAINT fk_movimientos_billetera FOREIGN KEY (id_billetera) REFERENCES Billeteras(id);


--Crear indices

CREATE INDEX idx_productos_categoria ON Productos(id_categoria);
CREATE INDEX idx_compras_usuario ON Compras(id_usuario);
CREATE INDEX idx_compras_empleado ON Compras(id_empleado);
CREATE INDEX idx_movimientos_billetera ON Movimientos(id_billetera);
CREATE INDEX idx_billeteras_usuario ON Billeteras(id_usuario);

-- Indices para búsquedas frecuentes

CREATE INDEX idx_usuarios_correo ON Usuarios(correo);
-- Porque el login siempre busca por correo

CREATE INDEX idx_compras_fecha ON Compras(fecha);
-- Porque los reportes de ventas filtran por rango de fechas

CREATE INDEX idx_movimientos_fecha ON Movimientos(fecha);
-- Porque el historial de billetera siempre va por fecha

CREATE TABLE refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES usuarios(id),
  token      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--FUNCIONES PARA TRIGGERS

--Función para crear una billetera a un usuario nuevo registrado
CREATE OR REPLACE FUNCTION create_wallet_user()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO billeteras (monto, fecha_creacion, id_usuario)
	VALUES (
		0,
		NOW(),
		NEW.id
	);

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Función para insertar un movimiento después de actualizar la Wallet
CREATE OR REPLACE FUNCTION log_wallet_transaction()
RETURNS TRIGGER AS $$
BEGIN
	IF OLD.monto <> NEW.monto THEN
		INSERT INTO movimientos (tipo, monto, fecha, id_billetera, balance_despues)
		VALUES (
			CASE
				WHEN NEW.monto > OLD.monto THEN 'recarga'
				ELSE 'descuento'
			END,
			ABS(NEW.monto - OLD.monto),
			NOW(),
			NEW.id,
			NEW.monto
		);
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Función para actualizar el stock al insertar una tupla en Brinda
CREATE OR REPLACE FUNCTION update_stock()
RETURNS TRIGGER AS $$
BEGIN

    IF TG_OP = 'INSERT' THEN
        UPDATE productos 
        SET stock = stock + NEW.cantidad
        WHERE id = NEW.id_producto;

    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE productos 
        SET stock = stock + (NEW.cantidad - OLD.cantidad)
        WHERE id = NEW.id_producto;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--TRIGGERS

CREATE TRIGGER tgr_log_wallet_transaction
AFTER UPDATE
ON billeteras
FOR EACH ROW
EXECUTE FUNCTION log_wallet_transaction();

CREATE TRIGGER tgr_create_wallet_user
AFTER INSERT
ON usuarios
FOR EACH ROW
EXECUTE FUNCTION create_wallet_user();

CREATE TRIGGER tgr_update_stock
AFTER INSERT OR UPDATE
ON brinda
FOR EACH ROW
EXECUTE FUNCTION update_stock();

CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT
  (SELECT COUNT(*) FROM usuarios WHERE activo = true)
    AS total_usuarios,

  (SELECT COUNT(*) FROM productos WHERE activo = true)
    AS total_productos,

  (SELECT COUNT(*) FROM compras
   WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', NOW()))
    AS compras_mes,

  (SELECT COALESCE(SUM(total), 0) FROM compras
   WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', NOW()))
    AS ingresos_mes,

  (SELECT p.nombre FROM detallecompras dc
   JOIN productos p ON p.id = dc.id_producto
   GROUP BY p.id, p.nombre
   ORDER BY SUM(dc.cantidad_producto) DESC
   LIMIT 1)
    AS producto_top,

  (SELECT c.nombre FROM detallecompras dc
   JOIN productos p ON p.id = dc.id_producto
   JOIN categorias c ON c.id = p.id_categoria
   GROUP BY c.id, c.nombre
   ORDER BY SUM(dc.cantidad_producto) DESC
   LIMIT 1)
    AS categoria_top,

  (SELECT COUNT(*) FROM billeteras WHERE monto > 0)
    AS billeteras_activas,

  (SELECT COALESCE(SUM(monto), 0) FROM billeteras)
    AS saldo_total;

-- ─── STORED PROCEDURES ─────────────────────────────────────────────────────

-- SP 1: Obtener información completa de un producto por ID
CREATE OR REPLACE FUNCTION sp_obtener_producto(
    p_id         IN  INT,
    p_nombre     OUT VARCHAR(60),
    p_precio     OUT DECIMAL(10,2),
    p_stock      OUT INT,
    p_activo     OUT BOOLEAN,
    p_categoria  OUT VARCHAR(60),
    p_id_categoria OUT INT
)
RETURNS RECORD
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT p.nombre, p.precio, p.stock, p.activo, c.nombre, p.id_categoria
    INTO p_nombre, p_precio, p_stock, p_activo, p_categoria, p_id_categoria
    FROM productos p
    JOIN categorias c ON c.id = p.id_categoria
    WHERE p.id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto con id % no encontrado', p_id;
    END IF;
END;
$$;

-- SP 2: Desactivar producto — parámetros IN/OUT y manejo de excepciones
CREATE OR REPLACE FUNCTION sp_desactivar_producto(
    p_id      IN  INT,
    p_success OUT BOOLEAN,
    p_mensaje OUT TEXT
)
RETURNS RECORD
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM productos WHERE id = p_id) THEN
        p_success := FALSE;
        p_mensaje := 'Producto con id ' || p_id || ' no encontrado';
        RETURN;
    END IF;

    IF NOT COALESCE((SELECT activo FROM productos WHERE id = p_id), FALSE) THEN
        p_success := FALSE;
        p_mensaje := 'El producto ya se encuentra inactivo';
        RETURN;
    END IF;

    UPDATE productos SET activo = false WHERE id = p_id;

    p_success := TRUE;
    p_mensaje := 'Producto desactivado exitosamente';

EXCEPTION WHEN OTHERS THEN
    p_success := FALSE;
    p_mensaje := 'Error al desactivar producto: ' || SQLERRM;
END;
$$;

-- SP 3: Activar producto — parámetros IN/OUT y manejo de excepciones
CREATE OR REPLACE FUNCTION sp_activar_producto(
    p_id      IN  INT,
    p_success OUT BOOLEAN,
    p_mensaje OUT TEXT
)
RETURNS RECORD
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM productos WHERE id = p_id) THEN
        p_success := FALSE;
        p_mensaje := 'Producto con id ' || p_id || ' no encontrado';
        RETURN;
    END IF;

    IF COALESCE((SELECT activo FROM productos WHERE id = p_id), FALSE) THEN
        p_success := FALSE;
        p_mensaje := 'El producto ya se encuentra activo';
        RETURN;
    END IF;

    UPDATE productos SET activo = true WHERE id = p_id;

    p_success := TRUE;
    p_mensaje := 'Producto activado exitosamente';

EXCEPTION WHEN OTHERS THEN
    p_success := FALSE;
    p_mensaje := 'Error al activar producto: ' || SQLERRM;
END;
$$;

-- SP 4: Recargar billetera — parámetros IN/OUT y manejo de excepciones
CREATE OR REPLACE FUNCTION sp_recargar_billetera(
    p_id_usuario  IN  INT,
    p_monto       IN  DECIMAL(10,2),
    p_nuevo_saldo OUT DECIMAL(10,2),
    p_success     OUT BOOLEAN,
    p_mensaje     OUT TEXT
)
RETURNS RECORD
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_monto <= 0 THEN
        p_success     := FALSE;
        p_mensaje     := 'El monto debe ser mayor a 0';
        p_nuevo_saldo := NULL;
        RETURN;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM billeteras WHERE id_usuario = p_id_usuario) THEN
        p_success     := FALSE;
        p_mensaje     := 'Billetera no encontrada para el usuario ' || p_id_usuario;
        p_nuevo_saldo := NULL;
        RETURN;
    END IF;

    UPDATE billeteras
       SET monto = monto + p_monto
     WHERE id_usuario = p_id_usuario
    RETURNING monto INTO p_nuevo_saldo;

    p_success := TRUE;
    p_mensaje := 'Recarga realizada exitosamente';

EXCEPTION WHEN OTHERS THEN
    p_success     := FALSE;
    p_mensaje     := 'Error al recargar billetera: ' || SQLERRM;
    p_nuevo_saldo := NULL;
END;
$$;

-- SP 5: Registrar suministro — transacción explícita con ROLLBACK
CREATE OR REPLACE PROCEDURE sp_registrar_suministro(
    IN p_id_proveedor INT,
    IN p_id_producto  INT,
    IN p_cantidad     INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_proveedor_existe BOOLEAN;
    v_producto_existe  BOOLEAN;
BEGIN
    IF p_cantidad <= 0 THEN
        ROLLBACK;
        RAISE EXCEPTION 'La cantidad debe ser mayor a 0';
    END IF;

    SELECT EXISTS(SELECT 1 FROM proveedores WHERE id = p_id_proveedor AND activo = true)
      INTO v_proveedor_existe;

    IF NOT v_proveedor_existe THEN
        ROLLBACK;
        RAISE EXCEPTION 'Proveedor con id % no encontrado o inactivo', p_id_proveedor;
    END IF;

    SELECT EXISTS(SELECT 1 FROM productos WHERE id = p_id_producto AND activo = true)
      INTO v_producto_existe;

    IF NOT v_producto_existe THEN
        ROLLBACK;
        RAISE EXCEPTION 'Producto con id % no encontrado o inactivo', p_id_producto;
    END IF;

    -- El trigger tgr_update_stock actualizará el stock automáticamente
    INSERT INTO brinda(id_proveedor, id_producto, cantidad)
    VALUES (p_id_proveedor, p_id_producto, p_cantidad);

    COMMIT;

EXCEPTION WHEN OTHERS THEN
    ROLLBACK;
    RAISE;
END;
$$;

-- ─── ROLES OF DB ─────────────────────────────────────
-- 5 roles with access by table and operation

CREATE ROLE rol_admin NOLOGIN;
CREATE ROLE rol_gerente NOLOGIN;
CREATE ROLE rol_empleado NOLOGIN;
CREATE ROLE rol_bodeguero NOLOGIN;
CREATE ROLE rol_cliente NOLOGIN;

-- rol_admin: total access to all tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rol_admin;

-- rol_gerente: sales supervision and personnel management; he can't delete finance registers
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_gerente;
GRANT ALL PRIVILEGES ON usuarios, empleados, roles TO rol_gerente;
GRANT INSERT, UPDATE ON compras, detallecompras TO rol_gerente;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_gerente;
REVOKE DELETE ON compras, detallecompras, movimientos FROM rol_gerente;

-- rol_empleado: process sales, check inventory, and manage customer wallets
GRANT SELECT ON productos, categorias, proveedores,
               compras, detallecompras, empleados,
               billeteras, usuarios TO rol_empleado;
GRANT ALL PRIVILEGES ON compras, detallecompras,
                        movimientos, billeteras TO rol_empleado;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_empleado;
REVOKE DELETE ON compras, detallecompras,
                movimientos, billeteras FROM rol_empleado;

-- rol_bodeguero: Inventory and supplier management; no access to sales or user data
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_bodeguero;
GRANT ALL PRIVILEGES ON productos, proveedores, brinda TO rol_bodeguero;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_bodeguero;
REVOKE DELETE ON productos, proveedores FROM rol_bodeguero;

-- rol_cliente: Browse the catalog, register purchases, and manage your own wallet.
GRANT SELECT ON productos, categorias TO rol_cliente;
GRANT ALL PRIVILEGES ON compras, detallecompras,
                        billeteras, movimientos TO rol_cliente;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_cliente;
REVOKE DELETE ON compras, detallecompras,
                billeteras, movimientos FROM rol_cliente;
REVOKE UPDATE ON movimientos FROM rol_cliente;