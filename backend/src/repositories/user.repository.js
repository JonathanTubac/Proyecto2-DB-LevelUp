import { pool } from "../config/db.js";

export const findAll = async ({ limit, offset, rol }) => {
    const { rows } = await pool.query(`
    SELECT
      u.id, u.nombre, u.correo, u.telefono, u.activo,
      TRIM(r.nombre) AS rol,
      COUNT(*) OVER() AS total
    FROM usuarios u
    JOIN roles r ON r.id = u.id_rol
    WHERE ($1::text IS NULL OR TRIM(r.nombre) ILIKE $1)
    ORDER BY u.nombre
    LIMIT $2 OFFSET $3
  `, [rol ?? null, limit, offset]);

    return {
        data: rows.map(({ total, ...u }) => u),
        total: parseInt(rows[0]?.total ?? 0),
    };
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT u.id, u.nombre, u.correo, u.telefono, u.activo, TRIM(r.nombre) AS rol
        FROM usuarios u JOIN roles r ON u.id_rol = r.id
        WHERE u.id = $1
    `, [id])

    return rows[0]
}

export const findByEmail = async (correo) => {
    const { rows } = await pool.query(`
    SELECT
      u.id, u.nombre, u.correo, u.password, u.telefono, u.activo,
      TRIM(r.nombre) AS rol,
      e.carnet AS empleado_carnet
    FROM usuarios u
    JOIN roles r ON r.id = u.id_rol
    LEFT JOIN empleados e ON e.id_usuario = u.id
    WHERE u.correo = $1 AND u.activo = true
  `, [correo]);
    return rows[0] ?? null;
};
export const create = async ({ name, email, password, phone, role_id }) => {
    const { rows } = await pool.query(`
        INSERT INTO usuarios(nombre, correo, password, telefono, id_rol)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nombre, correo, telefono, id_rol
    `, [name, email, password, phone, role_id]);

    return rows[0] ?? null
}

export const updateById = async (id, { name, email, phone, role_id }) => {
    const { rows } = await pool.query(`
        UPDATE usuarios
        SET nombre = $1, email = $2, telefono = $3, role_id = $4
        WHERE id = $5
        RETURNING id, nombre, correo, telefono
    `, [name, email, phone, role_id, id]);

    return rows[0] ?? null
}

export const deleteById = async (id) => {
    await pool.query(`UPDATE usuarios SET activo = false WHERE id = $1`, [id]);
};

export const activateById = async (id) => {
    await pool.query(`UPDATE usuarios SET activo = true WHERE id = $1`, [id]);
};