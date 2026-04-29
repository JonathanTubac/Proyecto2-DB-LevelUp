import * as walletRepository from '../repositories/wallet.repository.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

export const getWallets = async () => {
    return await walletRepository.findAll();
}

export const getMyWallet = async (userId) => {
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundError('Wallet not found!');
    return wallet;
}

export const rechargeWallet = async (userId, amount) => {
    if (amount <= 0) throw new ValidationError('Amount must be greater than 0');

    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundError('Wallet not found!');

    return await walletRepository.recharge(userId, amount);
}

export const purchaseWallet = async (userId, amount) => {
    if (amount <= 0) throw new ValidationError('Amount must be greater than 0');

    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundError('Wallet not found!');

    const updated = await walletRepository.purchase(userId, amount);
    if (!updated) throw new ValidationError('Cant afford!');

    return updated;
}