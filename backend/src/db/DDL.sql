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
	id_usuario INT NOT NULL, -- FK de Usuarios
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




--Inserción de datos

--ROLES 
INSERT INTO roles (nombre) VALUES
  ('Administrador'),
  ('Empleado'),
  ('Cliente');

-- CATEGORIAS 
INSERT INTO categorias (nombre) VALUES
  ('Consolas'),
  ('Videojuegos'),
  ('Accesorios'),
  ('Periféricos'),
  ('Merchandising');

-- PROVEEDORES 
INSERT INTO proveedores (nombre, activo) VALUES
  ('Nintendo Latinoamérica', true),
  ('Sony Interactive', true),
  ('Microsoft Xbox', true),
  ('Logitech Guatemala', true),
  ('GameStop Imports', true);

-- PRODUCTOS 
INSERT INTO productos (nombre, precio, stock, activo, id_categoria) VALUES
  -- Consolas (id_categoria = 1)
  ('Nintendo Switch OLED',        4500.00, 0, true, 1),
  ('PlayStation 5',               7500.00, 0, true, 1),
  ('Xbox Series X',               6800.00, 0, true, 1),
  ('Nintendo Switch Lite',        2800.00, 0, true, 1),

  -- Videojuegos (id_categoria = 2)
  ('The Legend of Zelda: TOTK',   800.00,  0, true, 2),
  ('God of War Ragnarok',         750.00,  0, true, 2),
  ('Elden Ring',                  700.00,  0, true, 2),
  ('FIFA 25',                     650.00,  0, true, 2),
  ('Spider-Man 2',                750.00,  0, true, 2),

  -- Accesorios (id_categoria = 3)
  ('Control DualSense PS5',       850.00,  0, true, 3),
  ('Control Xbox Series',         750.00,  0, true, 3),
  ('Joy-Con Nintendo Switch',     650.00,  0, true, 3),
  ('Charging Dock PS5',           400.00,  0, true, 3),

  -- Periféricos (id_categoria = 4)
  ('Headset Logitech G435',       750.00,  0, true, 4),
  ('Teclado Logitech G413',       850.00,  0, true, 4),
  ('Mouse Logitech G502',         700.00,  0, true, 4),

  -- Merchandising (id_categoria = 5)
  ('Figura Link Breath of Wild',  450.00,  0, true, 5),
  ('Polo PlayStation',            200.00,  0, true, 5),
  ('Taza Xbox',                   120.00,  0, true, 5);

-- BRINDA (activa el trigger que actualiza stock)
INSERT INTO brinda (id_proveedor, id_producto, cantidad) VALUES
  -- Nintendo Latinoamérica (id=1) provee consolas y juegos Nintendo
  (1, 1,  15),   -- Switch OLED
  (1, 4,  20),   -- Switch Lite
  (1, 5,  30),   -- Zelda TOTK
  (1, 12, 25),   -- Joy-Con
  (1, 17, 40),   -- Figura Link

  -- Sony Interactive (id=2) provee PlayStation
  (2, 2,  10),   -- PS5
  (2, 6,  25),   -- God of War
  (2, 9,  25),   -- Spider-Man 2
  (2, 10, 30),   -- DualSense
  (2, 13, 20),   -- Charging Dock

  -- Microsoft Xbox (id=3) provee Xbox
  (3, 3,  12),   -- Xbox Series X
  (3, 7,  20),   -- Elden Ring
  (3, 11, 25),   -- Control Xbox
  (3, 19, 50),   -- Taza Xbox

  -- Logitech Guatemala (id=4) provee periféricos
  (4, 14, 30),   -- Headset G435
  (4, 15, 20),   -- Teclado G413
  (4, 16, 25),   -- Mouse G502

  -- GameStop Imports (id=5) provee variedad
  (5, 8,  40),   -- FIFA 25
  (5, 18, 60);   -- Polo PlayStation

-- ─── USUARIOS ────────────────────────────────────────────────────────
-- passwords hasheadas con bcrypt (12 rounds)
-- password real de todos: Password1!
-- reemplaza estos hashes corriendo: await bcrypt.hash('Password1!', 12)
-- o usa este hash de ejemplo (válido para Password1!)

INSERT INTO usuarios (nombre, correo, password, telefono, activo, id_rol) VALUES
  -- Administrador (id_rol = 1)
  (
    'Admin LevelUp',
    'admin@levelup.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password1!
    '12345678',
    true,
    1
  ),

  -- Empleados (id_rol = 2)
  (
    'Carlos Pérez',
    'carlos@levelup.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '23456789',
    true,
    2
  ),
  (
    'María López',
    'maria@levelup.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '34567890',
    true,
    2
  ),

  -- Clientes (id_rol = 3)
  (
    'Juan García',
    'juan@gmail.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '45678901',
    true,
    3
  ),
  (
    'Ana Martínez',
    'ana@gmail.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '56789012',
    true,
    3
  ),
  (
    'Pedro Ramírez',
    'pedro@gmail.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '67890123',
    true,
    3
  );
-- el trigger tgr_create_wallet_user crea la billetera de cada usuario automáticamente

-- EMPLEADOS
-- vinculamos los usuarios con rol empleado
INSERT INTO empleados (carnet, sueldo, id_usuario) VALUES
  (1001, 5000.00, 2),  -- Carlos Pérez
  (1002, 4500.00, 3);  -- María López

-- RECARGAS DE BILLETERA 
-- recargamos las billeteras de los clientes
-- el trigger tgr_log_wallet_transaction registra los movimientos automáticamente
UPDATE billeteras SET monto = 10000.00 WHERE id_usuario = 4; -- Juan
UPDATE billeteras SET monto = 8500.00  WHERE id_usuario = 5; -- Ana
UPDATE billeteras SET monto = 5000.00  WHERE id_usuario = 6; -- Pedro

-- VERIFICACIÓN 
SELECT 'Roles'       AS tabla, COUNT(*) AS registros FROM roles
UNION ALL
SELECT 'Categorias',          COUNT(*) FROM categorias
UNION ALL
SELECT 'Proveedores',         COUNT(*) FROM proveedores
UNION ALL
SELECT 'Productos',           COUNT(*) FROM productos
UNION ALL
SELECT 'Brinda',              COUNT(*) FROM brinda
UNION ALL
SELECT 'Usuarios',            COUNT(*) FROM usuarios
UNION ALL
SELECT 'Empleados',           COUNT(*) FROM empleados
UNION ALL
SELECT 'Billeteras',          COUNT(*) FROM billeteras
UNION ALL
SELECT 'Movimientos',         COUNT(*) FROM movimientos;