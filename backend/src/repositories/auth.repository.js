import { pool } from "../config/db.js";

export const saveRefreshToken = async ({ userId, token }) => {
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token)
        VALUES ($1, $2)`,
        [userId, token]
    );
};

export const findRefreshToken = async (token) => {
    const {rows} = await pool.query(`
        SELECT * FROM refresh_tokens WHERE token = $1    
    `, [token])
};

export const deleteRefreshToken = async (token) => {
    await pool.query(`
        DELETE FROM refresh_tokens WHERE token = $1
    `, [token])
};

export const deleteAllUserTokens = async (userId) => {
    await pool.query(`
        DELETE FROM refresh_tokens WHERE user_id = $1
    `, [userId])
};