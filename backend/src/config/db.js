import { Pool } from 'pg'

export const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/levelup'
})

export const connect = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Postgres corriendo correctamente');
    } catch (error) {
        console.error('❌ Error de DB: ', error.message);
        process.exit(1);
    }
};
