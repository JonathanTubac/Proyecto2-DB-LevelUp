import { pool } from "../config/db.js";

export const findByName = async (name) => {
    const role = await pool.query(`
        SELECT *
        FROM roles
        WHERE nombre = $1
    `, [name])
    return role.rows[0]
}

export const findById = async (id) => {
    const role = await pool.query(`
        SELECT *
        FROM roles
        WHERE id = $1
    `, [id])
    return role.rows[0]
}