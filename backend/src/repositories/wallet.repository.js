import { pool, withTransaction } from "../config/db.js";

export const findAll = async ({ limit, offset }) => {
    const { rows } = await pool.query(`
    SELECT
      b.id, b.monto, b.fecha_creacion,
      u.nombre AS usuario,
      COUNT(*) OVER() AS total
    FROM billeteras b
    JOIN usuarios u ON u.id = b.id_usuario
    ORDER BY b.id
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

    return {
        data: rows.map(({ total, ...b }) => b),
        total: parseInt(rows[0]?.total ?? 0),
    };
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT b.id, b.monto, b.fecha_creacion, u.nombre FROM billeteras b
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.id = $1 AND u.activo = true 
    `, [id]);

    return rows[0];
}

export const findByUserId = async (userId) => {
    const { rows } = await pool.query(`
        SELECT b.id, b.monto, b.fecha_creacion, u.nombre FROM billeteras b 
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE u.id = $1
    `, [userId]);

    return rows[0]
};

export const updateById = async (amount, id) => {
    const { rows } = await pool.query(`
        UPDATE billeteras
        SET monto = $1
        WHERE id_usuario = $2
        RETURNING id, id_usuario, monto
    `, [amount, id]);

    return rows[0]
}

export const recharge = async (amount, userId) => {
    return await withTransaction(async (client) => {
        const { rows } = await client.query(`
            UPDATE billeteras
            SET monto = monto + $1
            WHERE id_usuario = $2
            RETURNING id, id_usuario, monto
        `, [amount, userId]);

        if (!rows[0]) return null

        return rows[0]
    });
};

export const purchase = async (amount, userId) => {
    return await withTransaction(async (client) => {
        const { rows } = await client.query(`
            UPDATE billeteras
            SET monto = monto - $1
            WHERE id_usuario = $2 AND monto >= $1
            RETURNING id, id_usuario, monto
        `, [amount, userId]);

        if (!rows[0]) return null

        return rows[0]
    })
}

export const purchaseWithCompra = async (client, userId, amount, id_compra) => {
    const { rows } = await client.query(`
    UPDATE billeteras
    SET monto = monto - $1
    WHERE id_usuario = $2 AND monto >= $1
    RETURNING id, id_usuario, monto
  `, [amount, userId]);

    if (rows[0]) {
        await client.query(`
      UPDATE movimientos
      SET id_compra = $1
      WHERE id = (
        SELECT id FROM movimientos
        WHERE id_billetera = $2
        ORDER BY fecha DESC
        LIMIT 1
      )
    `, [id_compra, rows[0].id]);
    }

    return rows[0] ?? null;
};