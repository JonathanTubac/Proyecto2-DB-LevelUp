import { pool } from "../config/db.js";

export const findAll = async () => {
    const {rows } = await pool.query(`
        SELECT *
        FROM proveedores
    `);

    return rows;
};

export const findById = async (id) => {
    const {rows} = await pool.query(`
        SELECT *
        FROM proveedores
        WHERE id = $1
    `, [id]);

    return rows[0];
};

export const create = async ({name}) => {
    const {rows} = await pool.query(`
        INSERT INTO proveedores (nombre)
        VALUES ($1)
        RETURNING *
    `);

    return rows[0];
};

export const update = async (id, {name}) => {
    const {rows} = await pool.query(`
        UPDATE proveedores
        SET nombre = $1
        WHERE id = $2    
    `, [name, id]);

    return rows[0];
};

export const deactivate = async (id) => {
    await pool.query(`
        UPDATE proveedores
        SET activo = false
        WHERE id = $1        
    `, [id]);
}
