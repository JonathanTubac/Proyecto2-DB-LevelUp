-- Data insertion by Jonathan Tubac - 24484
-- seed data

INSERT INTO roles (nombre) VALUES
  ('Administrador'),
  ('Empleado'),
  ('Cliente');

INSERT INTO categorias (nombre) VALUES
  ('Consolas'),
  ('Videojuegos'),
  ('Accesorios'),
  ('Periféricos'),
  ('Merchandising');

INSERT INTO proveedores (nombre, activo) VALUES
  ('Nintendo Latinoamérica',  true),
  ('Sony Interactive',        true),
  ('Microsoft Xbox',          true),
  ('Logitech Guatemala',      true),
  ('GameStop Imports',        true),
  ('Corsair Distribution',    true),
  ('Razer LATAM',             true),
  ('HyperX Guatemala',        true),
  ('SteelSeries México',      true),
  ('ASUS ROG Guatemala',      true),
  ('Turtle Beach Corp',       true),
  ('8BitDo Official',         true),
  ('Elgato Systems',          true),
  ('PowerA Accessories',      true),
  ('Mad Catz Revival',        true);

INSERT INTO productos (nombre, precio, stock, activo, id_categoria) VALUES
  -- Consolas (id_categoria = 1)
  ('Nintendo Switch OLED',          4500.00, 0, true, 1),
  ('PlayStation 5',                 7500.00, 0, true, 1),
  ('Xbox Series X',                 6800.00, 0, true, 1),
  ('Nintendo Switch Lite',          2800.00, 0, true, 1),
  ('Xbox Series S',                 4200.00, 0, true, 1),
  ('PlayStation 4 Slim',            3500.00, 0, true, 1),
  ('Steam Deck OLED',               6500.00, 0, true, 1),

  -- Videojuegos (id_categoria = 2)
  ('The Legend of Zelda: TOTK',      800.00, 0, true, 2),
  ('God of War Ragnarok',            750.00, 0, true, 2),
  ('Elden Ring',                     700.00, 0, true, 2),
  ('FIFA 25',                        650.00, 0, true, 2),
  ('Spider-Man 2',                   750.00, 0, true, 2),
  ('Hogwarts Legacy',                699.00, 0, true, 2),
  ('Starfield',                      699.00, 0, true, 2),
  ('Baldur''s Gate 3',               750.00, 0, true, 2),
  ('Mario Kart 8 Deluxe',            650.00, 0, true, 2),
  ('Cyberpunk 2077',                 600.00, 0, true, 2),
  ('The Last of Us Part I',          699.00, 0, true, 2),
  ('Forza Horizon 5',                650.00, 0, true, 2),
  ('Final Fantasy XVI',              750.00, 0, true, 2),

  -- Accesorios (id_categoria = 3)
  ('Control DualSense PS5',          850.00, 0, true, 3),
  ('Control Xbox Series',            750.00, 0, true, 3),
  ('Joy-Con Nintendo Switch',        650.00, 0, true, 3),
  ('Charging Dock PS5',              400.00, 0, true, 3),
  ('Control 8BitDo Pro 2',           550.00, 0, true, 3),
  ('Control PowerA Enhanced',        450.00, 0, true, 3),
  ('Base de Carga Xbox',             380.00, 0, true, 3),
  ('Funda Nintendo Switch OLED',     250.00, 0, true, 3),
  ('Memory Card PS5 1TB',           1200.00, 0, true, 3),

  -- Periféricos (id_categoria = 4)
  ('Headset Logitech G435',          750.00, 0, true, 4),
  ('Teclado Logitech G413',          850.00, 0, true, 4),
  ('Mouse Logitech G502',            700.00, 0, true, 4),
  ('Headset Razer BlackShark V2',    900.00, 0, true, 4),
  ('Mouse Razer DeathAdder V3',      850.00, 0, true, 4),
  ('Teclado Corsair K70 RGB',       1200.00, 0, true, 4),
  ('Headset HyperX Cloud II',        750.00, 0, true, 4),
  ('Mouse SteelSeries Rival 5',      700.00, 0, true, 4),
  ('Teclado ASUS ROG Strix',        1100.00, 0, true, 4),
  ('Mousepad Razer Goliathus',       350.00, 0, true, 4),
  ('Capturadora Elgato HD60 X',     1800.00, 0, true, 4),
  ('Headset Turtle Beach Stealth',   650.00, 0, true, 4),

  -- Merchandising (id_categoria = 5)
  ('Figura Link Breath of Wild',     450.00, 0, true, 5),
  ('Polo PlayStation',               200.00, 0, true, 5),
  ('Taza Xbox',                      120.00, 0, true, 5),
  ('Figura Master Chief Halo',       550.00, 0, true, 5),
  ('Figura Kratos God of War',       600.00, 0, true, 5),
  ('Hoodie Nintendo',                380.00, 0, true, 5),
  ('Poster Metal PlayStation',       180.00, 0, true, 5),
  ('Cojín Xbox',                     150.00, 0, true, 5),
  ('Figura Pikachu Pokemon',         350.00, 0, true, 5),
  ('Taza Nintendo Switch',           130.00, 0, true, 5),
  ('Camisa Zelda Edition',           220.00, 0, true, 5),
  ('Figura Cloud Final Fantasy',     500.00, 0, true, 5);

INSERT INTO brinda (id_proveedor, id_producto, cantidad) VALUES
  -- Nintendo Latinoamérica
  (1,  1,  15), (1,  4,  20), (1,  5,  30),
  (1,  8,  25), (1, 12,  25), (1, 16,  40),
  (1, 22,  35), (1, 43,  40), (1, 47,  50),
  (1, 49,  60), (1, 50,  45), (1, 51,  55),

  -- Sony Interactive
  (2,  2,  10), (2,  6,  25), (2, 11,  25),
  (2, 13,  30), (2, 19,  20), (2, 23,  20),
  (2, 28,  15),

  -- Microsoft Xbox
  (3,  3,  12), (3,  5,  18), (3,  7,  20),
  (3, 10,  20), (3, 14,  25), (3, 24,  30),
  (3, 45,  50), (3, 48,  40),

  -- Logitech Guatemala
  (4, 30,  30), (4, 31,  20), (4, 32,  25),

  -- GameStop Imports
  (5,  9,  40), (5, 12,  35), (5, 15,  30),
  (5, 20,  25), (5, 44,  60),

  -- Corsair
  (6, 35,  20), (6, 41,  15),

  -- Razer LATAM
  (7, 33,  25), (7, 34,  30), (7, 40,  50),

  -- HyperX
  (8, 36,  20),

  -- SteelSeries
  (9, 37,  22),

  -- ASUS ROG
  (10, 38,  15),

  -- Turtle Beach
  (11, 42,  20),

  -- 8BitDo
  (12, 25,  35),

  -- Elgato
  (13, 41,  10),

  -- PowerA
  (14, 26,  30), (14, 27,  25),

  -- Mad Catz
  (15, 39,  18);

-- ─── USUARIOS ────────────────────────────────────────────────────────
-- password: Password!1
-- hash: $2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2

INSERT INTO usuarios (nombre, correo, password, telefono, activo, id_rol) VALUES
  -- Administrador (id_rol = 1)
  ('Admin LevelUp',       'admin@levelup.com',     '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '12345678', true, 1),
  ('Sofía Admin',         'sofia.admin@levelup.com','$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '11111111', true, 1),

  -- Empleados (id_rol = 2)
  ('Carlos Pérez',        'carlos@levelup.com',    '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '23456789', true, 2),
  ('María López',         'maria@levelup.com',     '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '34567890', true, 2),
  ('Diego Ramos',         'diego@levelup.com',     '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '55566677', true, 2),
  ('Fernanda Torres',     'fernanda@levelup.com',  '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '44433322', true, 2),
  ('Roberto Castillo',    'roberto@levelup.com',   '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '66677788', true, 2),

  -- Clientes (id_rol = 3)
  ('Juan García',         'juan@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '45678901', true, 3),
  ('Ana Martínez',        'ana@gmail.com',         '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '56789012', true, 3),
  ('Pedro Ramírez',       'pedro@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '67890123', true, 3),
  ('Lucía Hernández',     'lucia@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '78901234', true, 3),
  ('Miguel Morales',      'miguel@gmail.com',      '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '89012345', true, 3),
  ('Valentina Cruz',      'vale@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '90123456', true, 3),
  ('Andrés Flores',       'andres@gmail.com',      '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '01234567', true, 3),
  ('Camila Reyes',        'camila@gmail.com',      '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '12340987', true, 3),
  ('Santiago Gómez',      'santi@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '23451098', true, 3),
  ('Isabella Vargas',     'isa@gmail.com',         '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '34562109', true, 3),
  ('Sebastián Ortiz',     'seba@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '45673210', true, 3),
  ('Mariana Jiménez',     'mari@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '56784321', true, 3),
  ('Daniel Mendoza',      'dani@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '67895432', true, 3),
  ('Gabriela Ríos',       'gaby@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '78906543', true, 3),
  ('Emilio Ruiz',         'emilio@gmail.com',      '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '89017654', true, 3),
  ('Renata Sánchez',      'renata@gmail.com',      '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '90128765', true, 3),
  ('Nicolás Aguilar',     'nico@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '01239876', true, 3),
  ('Sofía Peña',          'sofi@gmail.com',        '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '12350987', true, 3),
  ('Mateo Guerrero',      'mateo@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '23461098', true, 3),
  ('Paula Delgado',       'paula@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '34572109', true, 3),
  ('Tomás Navarro',       'tomas@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '45683210', true, 3),
  ('Elena Vega',          'elena@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '56794321', true, 3),
  ('Javier Molina',       'javier@gmail.com',      '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '67805432', true, 3),
  ('Natalia Campos',      'natalia@gmail.com',     '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '78916543', true, 3),
  ('Rodrigo Herrera',     'rodri@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '89027654', true, 3),
  ('Alejandra Ríos',      'ale@gmail.com',         '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '90138765', true, 3),
  ('Kevin Estrada',       'kevin@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '11223344', true, 3),
  ('Paola Fuentes',       'paola@gmail.com',       '$2b$12$1bFpX/tnn7LKPWEjJ5MR3uv4vd6TfzXYPvoPaUdaLFkUzpyfTFps2', '22334455', true, 3);

-- el trigger tgr_create_wallet_user crea las billeteras automáticamente

INSERT INTO empleados (carnet, sueldo, id_usuario) VALUES
  (1001, 5000.00, 3),  -- Carlos Pérez
  (1002, 4500.00, 4),  -- María López
  (1003, 4800.00, 5),  -- Diego Ramos
  (1004, 4600.00, 6),  -- Fernanda Torres
  (1005, 5200.00, 7);  -- Roberto Castillo

-- el trigger tgr_log_wallet_transaction registra los movimientos automáticamente
UPDATE billeteras SET monto = 50000.00 WHERE id_usuario = 1;  -- Admin
UPDATE billeteras SET monto = 10000.00 WHERE id_usuario = 8;  -- Juan
UPDATE billeteras SET monto = 8500.00  WHERE id_usuario = 9;  -- Ana
UPDATE billeteras SET monto = 5000.00  WHERE id_usuario = 10; -- Pedro
UPDATE billeteras SET monto = 7500.00  WHERE id_usuario = 11; -- Lucía
UPDATE billeteras SET monto = 3000.00  WHERE id_usuario = 12; -- Miguel
UPDATE billeteras SET monto = 12000.00 WHERE id_usuario = 13; -- Valentina
UPDATE billeteras SET monto = 4500.00  WHERE id_usuario = 14; -- Andrés
UPDATE billeteras SET monto = 9000.00  WHERE id_usuario = 15; -- Camila
UPDATE billeteras SET monto = 6000.00  WHERE id_usuario = 16; -- Santiago
UPDATE billeteras SET monto = 11000.00 WHERE id_usuario = 17; -- Isabella
UPDATE billeteras SET monto = 2500.00  WHERE id_usuario = 18; -- Sebastián
UPDATE billeteras SET monto = 8000.00  WHERE id_usuario = 19; -- Mariana
UPDATE billeteras SET monto = 15000.00 WHERE id_usuario = 20; -- Daniel
UPDATE billeteras SET monto = 3500.00  WHERE id_usuario = 21; -- Gabriela
UPDATE billeteras SET monto = 7000.00  WHERE id_usuario = 22; -- Emilio
UPDATE billeteras SET monto = 4000.00  WHERE id_usuario = 23; -- Renata
UPDATE billeteras SET monto = 20000.00 WHERE id_usuario = 24; -- Nicolás
UPDATE billeteras SET monto = 5500.00  WHERE id_usuario = 25; -- Sofía
UPDATE billeteras SET monto = 9500.00  WHERE id_usuario = 26; -- Mateo
UPDATE billeteras SET monto = 1500.00  WHERE id_usuario = 27; -- Paula
UPDATE billeteras SET monto = 6500.00  WHERE id_usuario = 28; -- Tomás
UPDATE billeteras SET monto = 18000.00 WHERE id_usuario = 29; -- Elena
UPDATE billeteras SET monto = 3200.00  WHERE id_usuario = 30; -- Javier
UPDATE billeteras SET monto = 7800.00  WHERE id_usuario = 31; -- Natalia
UPDATE billeteras SET monto = 4200.00  WHERE id_usuario = 32; -- Rodrigo
UPDATE billeteras SET monto = 13000.00 WHERE id_usuario = 33; -- Alejandra
UPDATE billeteras SET monto = 2800.00  WHERE id_usuario = 34; -- Kevin
UPDATE billeteras SET monto = 8200.00  WHERE id_usuario = 35; -- Paola