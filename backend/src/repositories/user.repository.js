import { pool } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT id, nombre, correo, telefono, id_rol 
        FROM usuarios
        WHERE activo = true
    `)

    return rows;
}

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM usuarios
        WHERE id = $1
    `, [id])

    return rows[0]
}

export const create = async ({ name, email, password, phone, role_id }) => {
    const { rows } = await pool.query(`
        INSERT INTO usuarios(nombre, correo, password, telefono, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nombre, correo, telefono
    `, [name, email, password, phone, role_id]);

    return rows[0] ?? null
}

export const updateById = async (id, { name, email, phone, role_id }) => {
    const { rows } = await pool.query(`
        UPDATE usuarios
        SET nombre = $1, email = $2, telefono = $3, role_id = $4
        WHERE id = $5
        RETURNING id, nombre, correo, telefono
    `, [name, email, phone, role_id, id]);

    return rows[0] ?? null
}

export const deleteById = async (id) => {
    await pool.query(`
        UPDATE usuarios
        SET activo = false
        WHERE id = $1
    `, [id])
}