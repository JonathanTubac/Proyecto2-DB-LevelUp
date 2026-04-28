import { pool } from "../config/db.js";

export const findAll = async () => {
  const { rows } = await pool.query(`
        SELECT p.id, p.nombre, p.precio, p.stock, c.nombre AS categoria
        FROM productos p
        JOIN categorias c ON p.id_categoria = c.id
        WHERE p.activo = true
    `);

  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    `
        SELECT p.id, p.nombre, p.precio, p.stock, c.nombre AS categoria FROM productos p 
        JOIN categorias c ON p.id_categoria = c.id
        WHERE p.id = $1
    `,
    [id],
  );

  return rows[0];
};

export const create = async ({ name, price, stock, id_category }) => {
  const { rows } = await pool.query(
    `
        INSERT INTO productos (nombre, precio, stock, id_categoria)
        VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [name, price, stock, id_category],
  );

  return rows[0];
};

export const update = async (id, { name, price, stock, id_category }) => {
  const { rows } = await pool.query(
    `
        UPDATE productos 
        SET nombre = $1, precio = $2, stock =$3, id_categoria = $4
        WHERE id = $5
        RETURNING *
    `,
    [name, price, stock, id_category, id],
  );

  return rows[0];
};

export const deactivate = async (id) => {
    const { rows } = await pool.query(`
        UPDATE productos
        SET activo = false
        WHERE id = $1
    `, [id])

    return rows[0]
};