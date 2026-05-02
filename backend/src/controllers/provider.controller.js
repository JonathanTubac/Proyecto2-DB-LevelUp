import * as providerService from '../services/provider.service.js'

export const getAll = async (req, res, next) => {
    try {
        const providers = await providerService.getProviders();
        res.status(200).json({ success: true, data: providers });
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
        const { id } = req.params;
        await providerService.deactivateProvider(id);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}