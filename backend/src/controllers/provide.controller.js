import * as provideService from '../services/provide.service.js'

export const getAll = async (req, res, next) => {
    try {
        const provides = await provideService.getAllProvides();
        res.status(200).json({ success: true, data: provides });
    } catch (err) {
        next(err);
    }
}

export const create = async (req, res, next) => {
    try {
        const { id_prov, id_prod, amount } = req.body;
        const provide = await provideService.createProvide({ id_prov, id_prod, amount });
        res.status(201).json({ success: true, data: provide });
    } catch (err) {
        next(err);
    }
}

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const updated = await provideService.updateProvide(id, { amount });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
}