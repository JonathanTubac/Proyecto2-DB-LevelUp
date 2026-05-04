import * as compraService from '../services/compra.service.js'
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
    try {
        const { data, total } = await compraService.getCompras(req.query);
        const { page, limit } = getPagination(req.query);
        res.status(200).json({ success: true, ...paginatedResponse(data, total, page, limit) });
    } catch (err) {
        next(err);
    }
}

export const create = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { tipo, productos } = req.body;

    const result = await compraService.createCompra(userId, {
      tipo,
      productos,
      id_empleado: req.user.carnet ?? null,
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
        const { data, total } = await compraService.getMyCompras(userId, req.query);
        const { page, limit } = getPagination(req.query);
        res.status(200).json({ success: true, ...paginatedResponse(data, total, page, limit) });
    } catch (err) {
        next(err);
    }
}