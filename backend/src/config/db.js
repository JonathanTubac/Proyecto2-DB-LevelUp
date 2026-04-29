import { Pool } from 'pg'

export const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/levelup'
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
