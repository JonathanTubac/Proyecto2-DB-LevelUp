import { pool } from "../config/db.js";

export const findAll = async ({ limit, offset, nombre }) => {
    const { rows } = await pool.query(`
    SELECT
      id, nombre,
      COUNT(*) OVER() AS total
    FROM categorias
    WHERE ($1::text IS NULL OR nombre ILIKE '%' || $1 || '%')
    ORDER BY nombre
    LIMIT $2 OFFSET $3
  `, [nombre ?? null, limit, offset]);

    return {
        data: rows.map(({ total, ...c }) => c),
        total: parseInt(rows[0]?.total ?? 0),
    };
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT * FROM categorias WHERE id = $1
    `, [id]);

    return rows[0];
};

export const create = async ({ name }) => {
    const { rows } = await pool.query(`
        INSERT INTO categorias (nombre) 
        VALUES ($1)
        RETURNING * 
    `, [name]);

    return rows[0];
}

export const update = async (id, { name }) => {
    const { rows } = await pool.query(`
        UPDATE categorias
        SET nombre = $1
        WHERE id = $2  
        RETURNING *  
    `, [name, id])
}