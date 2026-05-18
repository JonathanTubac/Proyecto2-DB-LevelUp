import * as compraService from '../services/compra.service.js'
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { ForbiddenError } from '../utils/errors.js';

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
        const compra = await compraService.getCompraById(id, req.user.id, req.user.rol);
        res.status(200).json({ success: true, data: compra });
    } catch (err) {
        next(err);
    }
};

export const createPresencial = async (req, res, next) => {
    try {
        const id_empleado = req.user.carnet;
        if (!id_empleado)
            return next(new ForbiddenError('Solo empleados con carnet registrado pueden procesar ventas presenciales'));

        const { id_usuario_cliente, productos } = req.body;

        const result = await compraService.createCompra(id_usuario_cliente, {
            tipo: 'presencial',
            productos,
            id_empleado,
        });

        res.status(201).json({ success: true, data: result });
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

export const getMyReport = async (req, res, next) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const report = await compraService.getMyReport(
      req.user.id,
      { fecha_inicio, fecha_fin }
    );
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};