import { pool } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT * FROM categorias    
    `);

    return rows;
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT * FROM categorias WHERE id = $1
    `, [id]);

    return rows[0];
};

export const create = async ({name}) => {
    const {rows} = await pool.query(`
        INSERT INTO categorias (nombre) 
        VALUES ($1)
        RETURNING * 
    `, [name]);

    return rows[0];
}

export const update = async (id, {name}) => {
    const {rows} = await pool.query(`
        UPDATE categorias
        SET nombre = $1
        WHERE id = $2  
        RETURNING *  
    `, [name, id])
}