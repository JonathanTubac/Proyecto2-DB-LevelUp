import * as providerService from '../services/provider.service.js'
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
    try {
        const { data, total } = await providerService.getProviders(req.query);
        const { page, limit } = getPagination(req.query);
        res.status(200).json({ success: true, ...paginatedResponse(data, total, page, limit) });
    } catch (err) {
        next(err);
    }
}

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const provider = await providerService.getProvider(id);
        res.status(200).json({ success: true, data: provider });
    } catch (err) {
        next(err);
    }
}

export const create = async (req, res, next) => {
    try {
        const { name } = req.body;
        const provider = await providerService.createProvider({ name });
        res.status(201).json({ success: true, data: provider });
    } catch (err) {
        next(err);
    }
}

export const updateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updated = await providerService.updateProvider(id, { name });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
}

export const deactivateById = async (req, res, next) => {
    try {
        await providerService.deactivateProvider(req.params.id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const activateById = async (req, res, next) => {
    try {
        await providerService.activateProvider(req.params.id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};