import { pool } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT c.id, c.tipo, c.fecha, c.total, c.id_usuario, c.id_empleado,
        json_agg(
            json_build_object(
                'id_producto', dc.id_producto,
                'nombre', p.nombre,
                'cantidad', dc.cantidad_producto,
                'precio_unitario', dc.precio_unitario
            )
        ) AS detalle
        FROM compras c
        JOIN detallecompras dc ON dc.id_compra = c.id
        JOIN productos p ON p.id = dc.id_producto
        GROUP BY c.id 
    `);

    return rows;
};

export const create = async (client, { tipo, total, id_usuario, id_empleado }) => {
    const { rows } = await client.query(`
       INSERT INTO compras (tipo, total, id_usuario, id_empleado)
       VALUES ($1, $2, $3, $4)
       RETURNING id, tipo, fecha, total, id_usuario, id_empleado 
    `, [tipo, total, id_usuario, id_empleado]);

    return rows[0];
};

export const createDetalle = async (client, { id_compra, id_producto, cantidad_producto, precio_unitario }) => {
    const { rows } = await client.query(`
        INSERT INTO detallecompras (id_compra, id_producto, cantidad_producto, precio_unitario)
        VALUES ($1, $2, $3, $4)
        RETURNING id_compra, id_producto, cantidad_producto, precio_unitario
    `, [id_compra, id_producto, cantidad_producto, precio_unitario]);

    return rows[0];
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
       SELECT c.id, c.tipo, c.fecha, c.total, c.id_usuario, c.id_empleado,
       json_agg(
        json_build_object(
            'id_producto', dc.id_producto,
            'nombre', p.nombre,
            'cantidad', dc.cantidad_producto,
            'precio_unitario', dc.precio_unitario
        )
       ) AS detalle
       FROM compras c
       JOIN detallecompras dc ON dc.id_compra = c.id
       JOIN productos p ON p.id = dc.id_producto
       WHERE c.id = $1
       GROUP BY c.id 
    `, [id]);

    return rows[0] ?? null;
};

export const findByUserId = async (id_usuario) => {
    const { rows } = await pool.query(`
        SELECT c.id, c.tipo, c.fecha, c.total,
        json_agg(
            json_build_object(
                'id_producto', dc.id_producto,
                'nombre', p.nombre,
                'cantidad', dc.cantidad_producto,
                'precio_unitario', dc.precio_unitario
            )
        ) AS detalle
        FROM compras c
        JOIN detallecompras dc ON dc.id_compra = c.id
        JOIN productos p ON p.id = dc.id_producto
        WHERE c.id_usuario = $1
        GROUP BY c.id
        ORDER BY c.fecha DESC
    `, [id_usuario]);

    return rows;
};