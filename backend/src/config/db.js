import 'dotenv/config'
import { Pool } from 'pg'

export const pool = new Pool({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
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
