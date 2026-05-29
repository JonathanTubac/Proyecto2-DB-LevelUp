import { pool } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT pv.nombre AS proveedor, pd.nombre AS producto, b.cantidad FROM brinda b
        JOIN proveedores pv ON b.id_proveedor = pv.id
        JOIN productos pd ON b.id_producto = pd.id
    `);

    return rows;
}

export const create = async ({ id_prov, id_prod, amount }) => {
    const { rows } = await pool.query(`
       INSERT INTO brinda (id_proveedor, id_producto, cantidad)
       VALUES ($1, $2, $3) 
       RETURNING *
    `, [id_prov, id_prod, amount]);

    return rows;
}

export const update = async (id, { amount }) => {
    const { rows } = await pool.query(`
        UPDATE brinda
        SET cantidad = $1
        WHERE id = $2
        RETURNING *
    `, [amount, id]);

    return rows[0];
}

export const findLastByProviderAndProduct = async (id_proveedor, id_producto) => {
    const { rows } = await pool.query(`
        SELECT b.id, b.id_proveedor, b.id_producto, b.cantidad, b.fecha,
               pv.nombre AS proveedor, pd.nombre AS producto
        FROM brinda b
        JOIN proveedores pv ON b.id_proveedor = pv.id
        JOIN productos   pd ON b.id_producto  = pd.id
        WHERE b.id_proveedor = $1 AND b.id_producto = $2
        ORDER BY b.fecha DESC
        LIMIT 1
    `, [id_proveedor, id_producto]);
    return rows[0] ?? null;
};