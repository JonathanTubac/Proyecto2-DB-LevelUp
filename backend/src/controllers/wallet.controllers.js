import * as walletService from '../services/wallet.service.js'
import { update } from './user.controller.js';

export const getAll = async (req, res, next) => {
    try {
        const wallets = await walletService.getWallets();
        res.status(200).json({ success: true, data: wallets });
    } catch (err) {
        next(err);
    }

}

export const getById = async (req, res, next) => {
    try {
        const wallet = await walletService.getWalletById(req.params.id);
        res.status(200).json({ success: true, data: wallet });
    } catch (err) {
        next(err);
    }
}

export const updateById = async (req, res, next) => {
    try {
        const updated = await walletService.updateWallet(req.body.amount, req.params.id);
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
}

export const getMyWallet = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const wallet = await walletService.getMyWallet(userId);
        res.status(200).json({ success: true, data: wallet });
    } catch (err) {
        next(err);
    }
}

export const recharge = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { amount } = req.body;
        await walletService.rechargeWallet(userId, amount);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}

export const purchase = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { amount } = req.body;
        await walletService.purchaseWallet(userId, amount);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}