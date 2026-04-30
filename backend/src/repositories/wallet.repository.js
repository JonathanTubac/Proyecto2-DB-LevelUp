import { pool, withTransaction } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT b.id, b.monto, b.fecha_creacion, u.nombre FROM billeteras b
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.activo = true
    `)

    return rows
};

export const findById = async (id) => {
    const {rows} = await pool.query(`
        SELECT b.id, b.monto, b.fecha_creacion, u.nombre FROM billeteras b
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.id = $1 AND u.activo = true 
    `, [id]);

    return rows[0];
}

export const findByUserId = async (userId) => {
    const {rows} = await pool.query(`
        SELECT b.id, b.monto, b.fecha_creacion, u.nombre FROM billeteras b 
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.id = $1
    `, [userId]);

    return rows[0]
};

export const updateById = async (amount, id) => {
    const {rows} = await pool.query(`
        UPDATE billeteras
        SET monto = $1
        WHERE id_usuario = $2
        RETURNING id, id_usuario, monto
    `, [amount, id]);

    return rows[0]
}

export const recharge = async (amount, userId) => {
    return await withTransaction(async (client) => {
        const {rows} = await client.query(`
            UPDATE billeteras
            SET monto = monto + $1
            WHERE id_usuario = $2
            RETURNING id, id_usuario, monto
        `, [amount, userId]);

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