import { use } from "react";
import { pool, withTransaction } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT * FROM billeteras b
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.activo = true
    `)

    return rows
};

export const findByUserId = async (userId) => {
    const {rows} = await pool.query(`
        SELECT * FROM billeteras b 
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.id = $1
    `, [userId]);

    return rows[0]
};

export const update = async (user_id) => {
    const {rows} = await pool.query(`
        UPDATE 
    `)
}

export const recharge = async (amount, user_id) => {
    return await withTransaction(async (client) => {
        const {rows} = await client.query(`
            UPDATE billeteras
            SET monto = monto + $1
            WHERE id_usuario = $2
            RETURNING id, id_usuario, monto
        `, [amount, user_id]);

        if (!rows[0]) return null

        return rows[0]
    });
};

export const purchase = async (amount, userId) => {
    return await withTransaction(async (client) => {
        const {rows} = await client.query(`
            UPDATE billeteras
            SET monto = monto - $1
            WHERE id_usuario = $2 AND monto >= $1
            RETURNING id, id_usuario, monto
        `, [amount, userId]);
        
        if(!rows[0]) return null

        return rows[0]
    })
}