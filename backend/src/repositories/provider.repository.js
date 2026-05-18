import { pool } from "../config/db.js";

export const findAll = async ({ limit, offset, nombre, showAll = false }) => {
    const { rows } = await pool.query(`
    SELECT
      id, nombre, activo,
      COUNT(*) OVER() AS total
    FROM proveedores
    WHERE ($4::boolean = true OR activo = true)
      AND ($1::text IS NULL OR nombre ILIKE '%' || $1 || '%')
    ORDER BY nombre
    LIMIT $2 OFFSET $3
  `, [nombre ?? null, limit, offset, showAll]);

    return {
        data: rows.map(({ total, ...p }) => p),
        total: parseInt(rows[0]?.total ?? 0),
    };
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM proveedores
        WHERE id = $1
    `, [id]);

    return rows[0];
};

export const create = async ({ name }) => {
    const { rows } = await pool.query(`
        INSERT INTO proveedores (nombre)
        VALUES ($1)
        RETURNING *
    `, [name]);

    return rows[0];
};

export const update = async (id, { name }) => {
    const { rows } = await pool.query(`
        UPDATE proveedores
        SET nombre = $1
        WHERE id = $2
        RETURNING *
    `, [name, id]);

    return rows[0];
};

export const deactivate = async (id) => {
    await pool.query(`UPDATE proveedores SET activo = false WHERE id = $1`, [id]);
};

export const activate = async (id) => {
    await pool.query(`UPDATE proveedores SET activo = true WHERE id = $1`, [id]);
};
