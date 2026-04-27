import * as userService from '../services/user.service.js'

export const getAll = async (req, res, next) => {
    try {
        const users = await userService.getUsers()
        res.json({ success: true, data: users })
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
        const { name, email, password, phone } = req.body;
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