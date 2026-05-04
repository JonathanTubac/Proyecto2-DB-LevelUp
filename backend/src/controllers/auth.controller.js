import * as authService from '../services/auth.service.js'

export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role_id } = req.body;
        const result = await authService.register({ name, email, password, phone, role_id });
        res.status(201).json({ success: true, data: result })
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refresh(refreshToken);
        res.json({ success: true, data: tokens });
    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}