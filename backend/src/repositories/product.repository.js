import { pool } from "../config/db.js";

export const findAll = async ({ limit, offset, category, name }) => {
  const { rows } = await pool.query(`
    SELECT
      p.id, p.nombre, p.precio, p.stock, p.activo,
      c.nombre AS categoria,
      COUNT(*) OVER() AS total
    FROM productos p
    JOIN categorias c ON c.id = p.id_categoria
    WHERE p.activo = true
      AND ($1::int IS NULL OR p.id_categoria = $1)
      AND ($2::text IS NULL OR p.nombre ILIKE '%' || $2 || '%')
    ORDER BY p.nombre
    LIMIT $3 OFFSET $4
  `, [category ?? null, name ?? null, limit, offset]);

  return {
    data: rows.map(({ total, ...p }) => p),
    total: parseInt(rows[0]?.total ?? 0),
  };
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

export const decreaseStock = async (client, id, cantidad) => {
  const { rows } = await client.query(`
    UPDATE productos
    SET stock = stock - $1
    WHERE id = $2 AND stock >= $1
    RETURNING id, nombre, stock
  `, [cantidad, id]);

  return rows[0] ?? null
}