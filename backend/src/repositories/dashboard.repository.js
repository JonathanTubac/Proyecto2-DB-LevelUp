import { pool } from '../config/db.js';

export const getMetrics = async () => {
  const { rows } = await pool.query(`SELECT * FROM dashboard_metrics`);
  return rows[0];
};