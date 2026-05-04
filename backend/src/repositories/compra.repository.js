import { pool } from "../config/db.js";

export const findAll = async ({ limit, offset, tipo, fecha_inicio, fecha_fin }) => {
    const { rows } = await pool.query(`
    SELECT
      c.id, c.tipo, c.fecha, c.total,
      c.id_usuario, c.id_empleado,
      COUNT(*) OVER() AS total_count
    FROM compras c
    WHERE ($1::text IS NULL      OR c.tipo = $1)
      AND ($2::timestamp IS NULL OR c.fecha >= $2)
      AND ($3::timestamp IS NULL OR c.fecha <= $3)
    ORDER BY c.fecha DESC
    LIMIT $4 OFFSET $5
  `, [tipo ?? null, fecha_inicio ?? null, fecha_fin ?? null, limit, offset]);

    return {
        data: rows.map(({ total_count, ...c }) => c),
        total: parseInt(rows[0]?.total_count ?? 0),
    };
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

export const findByUserId = async (id_usuario, { limit, offset }) => {
    const { rows } = await pool.query(`
    SELECT
      c.id, c.tipo, c.fecha, c.total,
      json_agg(
        json_build_object(
          'id_producto',     dc.id_producto,
          'nombre',          p.nombre,
          'cantidad',        dc.cantidad_producto,
          'precio_unitario', dc.precio_unitario
        )
      ) AS detalle,
      COUNT(*) OVER() AS total_count
    FROM compras c
    JOIN detallecompras dc ON dc.id_compra = c.id
    JOIN productos p ON p.id = dc.id_producto
    WHERE c.id_usuario = $1
    GROUP BY c.id
    ORDER BY c.fecha DESC
    LIMIT $2 OFFSET $3
  `, [id_usuario, limit, offset]);

    return {
        data: rows.map(({ total_count, ...c }) => c),
        total: parseInt(rows[0]?.total_count ?? 0),
    };
};