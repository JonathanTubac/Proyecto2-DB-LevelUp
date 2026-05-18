import 'dotenv/config'
import { Pool } from 'pg'

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL ||
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export const withTransaction = async (fn) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err
    } finally {
        client.release();
    }
}

export const connect = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Postgres corriendo correctamente');
    } catch (error) {
        console.error('❌ Error de DB: ', error.message);
        process.exit(1);
    }
};
