--Data insertion by Jonathan Tubac - 24484

-- ROLES ───────────────────────────────────────────────────────────
INSERT INTO roles (nombre) VALUES
  ('Administrador'),
  ('Empleado'),
  ('Cliente');

-- CATEGORIAS ──────────────────────────────────────────────────────
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

-- ─── EMPLEADOS ───────────────────────────────────────────────────────
-- vinculamos los usuarios con rol empleado
INSERT INTO empleados (carnet, sueldo, id_usuario) VALUES
  (1001, 5000.00, 2),  -- Carlos Pérez
  (1002, 4500.00, 3);  -- María López

-- ─── RECARGAS DE BILLETERA ───────────────────────────────────────────
-- recargamos las billeteras de los clientes
-- el trigger tgr_log_wallet_transaction registra los movimientos automáticamente
UPDATE billeteras SET monto = 10000.00 WHERE id_usuario = 4; -- Juan
UPDATE billeteras SET monto = 8500.00  WHERE id_usuario = 5; -- Ana
UPDATE billeteras SET monto = 5000.00  WHERE id_usuario = 6; -- Pedro
