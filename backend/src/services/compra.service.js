import { pool, withTransaction } from '../config/database.js';
import * as compraRepo from '../repositories/compra.repository.js';
import * as productRepo from '../repositories/product.repository.js';
import * as walletRepo from '../repositories/wallet.repository.js';
import {
    NotFoundError,
    ValidationError
} from '../utils/errors.js';

export const createCompra = async (userId, { tipo, productos, id_empleado }) => {
    if (!productos || productos.length === 0)
        throw new ValidationError('You must send al least one product!');

    const productosConPrecio = [];

    for (const item of productos) {
        const product = await productRepo.findById(item.id_producto);

        if (!product)
            throw new NotFoundError(`Product ${item.id_producto} not found!`);

        if (!product.activo)
            throw new ValidationError(`Product ${product.nombre} is not available`);

        if (product.stock < item.cantidad)
            throw new ValidationError(`Insufficent stock for ${product.nombre}. Available: ${product.stock}`);

        productosConPrecio.push({
            id_producto: product.id,
            nombre: product.nombre,
            cantidad_producto: item.cantidad,
            precio_unitario: product.precio,
        });
    }

    const total = productosConPrecio.reduce((acc, item) => {
        return acc + (item.precio_unitario * item.cantidad_producto);
    }, 0);

    const wallet = await walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundError('Wallet not found!');
    if (wallet.monto < total)
        throw new ValidationError(`Insufficient credits. Your credits: Q${wallet.monto}, Total: Q${total}`);

    return await withTransaction(async (client) => {
        const compra = await compraRepo.create(client, {
            tipo,
            total,
            id_usuario: userId,
            id_empleado: id_empleado ?? null,
        });

        for (const item of productosConPrecio) {
            await compraRepo.createDetalle(client, {
                id_compra: compra.id,
                id_producto: item.id_producto,
                cantidad_producto: item.cantidad_producto,
                precio_unitario: item.precio_unitario,
            });

            const stockUpdated = await productRepo.decreaseStock(
                client,
                item.id_producto,
                item.cantidad_producto
            );

            if (!stockUpdated)
                throw new ValidationError(`Insufficient stock for ${item.nombre}!`);
        }

        const walletUpdated = await walletRepo.purchaseWithCompra(
            client,
            userId,
            total,
            compra.id
        );

        if (!walletUpdated)
            throw new ValidationError('Insufficient credits!');

        return {
            compra: {
                id: compra.id,
                tipo: compra.tipo,
                fecha: compra.fecha,
                total: compra.total,
            },
            detalle: productosConPrecio,
            saldo_restante: walletUpdated.monto,
        };
    });
};

export const getCompraById = async (id, userId) => {
    const compra = await compraRepo.findById(id);
    if (!compra) throw new NotFoundError('purchase not found!');

    if (compra.id_usuario !== userId)
        throw new NotFoundError('purchase not found!');

    return compra;
};

export const getMyCompras = async (userId) => {
    return await compraRepo.findByUserId(userId);
};