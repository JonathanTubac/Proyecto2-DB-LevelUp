import * as walletRepository from '../repositories/wallet.repository.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

export const getWallets = async () => {
    return await walletRepository.findAll();
}

export const getWalletById = async (id) => {
    const wallet = await walletRepository.findById(id);
    if(!wallet) throw new NotFoundError('Wallet not found!');

    return wallet;
}

export const updateWallet = async (amount, id) => {
    if (amount <= 0) throw new ValidationError('Amount must be greater than 0');

    const wallet = await walletRepository.findById(id);
    if(!wallet) throw new NotFoundError('Wallet not found!');

    const updated = await walletRepository.updateById(amount, id);
    
    return updated;
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

    return await walletRepository.recharge(amount, userId);
}

export const purchaseWallet = async (userId, amount) => {
    if (amount <= 0) throw new ValidationError('Amount must be greater than 0');

    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundError('Wallet not found!');

    const updated = await walletRepository.purchase(amount, userId);
    if (!updated) throw new ValidationError('Cant afford!');

    return updated;
}