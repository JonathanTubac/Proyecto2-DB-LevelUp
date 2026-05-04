import * as userService from '../services/user.service.js'
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
    try {
        const { data, total } = await userService.getUsers(req.query);
        const { page, limit } = getPagination(req.query);
        res.json({ success: true, ...paginatedResponse(data, total, page, limit) });
    } catch (err) {
        next(err)
    }
}

export const getById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id)
        res.json({ success: true, data: user })
    } catch (err) {
        next(err)
    }
}

export const create = async (req, res, next) => {
    try {
        const { name, email, password, phone, role_id } = req.body;
        const user = await userService.registerUser({ name, email, password, phone });
        res.status(201).json({ success: true, data: user })
    } catch (err) {
        next(err)
    }
};

export const update = async (req, res, next) => {
    try {
        const { name, email, phone, role_id } = req.body;
        const user = await userService.updateUser(req.params.id, { name, email, phone, role_id })
        res.json({ success: true, data: user })
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        const id = req.params.id;
        await userService.deleteUser(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}