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
    `, [id_prov, id_prod, amount]);

    return rows;
}