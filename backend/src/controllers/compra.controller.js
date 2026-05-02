import e from 'express';
import * as compraService from '../services/compra.service.js'

export const getAll = async (req, res, next) => {
    try {
        const compras = await compraService.getCompras();
        res.status(200).json({success:true, data: compras});
    } catch (err) {
        next(err);
    }
}

export const create = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { tipo, productos, id_empleado } = req.body;
        const result = await compraService.createCompra(userId, {
            tipo,
            productos,
            id_empleado
        });
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const compra = await compraService.getCompraById(id, userId);
        res.status(200).json({ success: true, data: compra });
    } catch (err) {
        next(err);
    }
};

export const getUserCompras = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const compras = await compraService.getMyCompras(userId);
        res.status(200).json({ success: true, data: compras });
    } catch (err) {
        next(err);
    }
}