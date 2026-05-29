import { pool } from '../config/db.js';

// SP 1 — Obtener información completa de un producto
export const spObtenerProducto = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM sp_obtener_producto($1)', [id]
    );
    return rows[0] ?? null;
};

// SP 2 — Desactivar producto (IN/OUT params + manejo de excepciones)
export const spDesactivarProducto = async (id) => {
    const { rows } = await pool.query(
        'SELECT p_success, p_mensaje FROM sp_desactivar_producto($1)', [id]
    );
    return rows[0];
};

// SP 3 — Activar producto (IN/OUT params + manejo de excepciones)
export const spActivarProducto = async (id) => {
    const { rows } = await pool.query(
        'SELECT p_success, p_mensaje FROM sp_activar_producto($1)', [id]
    );
    return rows[0];
};

// SP 4 — Recargar billetera (IN/OUT params + manejo de excepciones)
export const spRecargarBilletera = async (userId, amount) => {
    const { rows } = await pool.query(
        'SELECT p_nuevo_saldo, p_success, p_mensaje FROM sp_recargar_billetera($1, $2)',
        [userId, amount]
    );
    return rows[0];
};

// SP 5 — Registrar suministro (PROCEDURE con ROLLBACK explícito)
export const spRegistrarSuministro = async (id_proveedor, id_producto, cantidad) => {
    await pool.query(
        'CALL sp_registrar_suministro($1, $2, $3)',
        [id_proveedor, id_producto, cantidad]
    );
};
