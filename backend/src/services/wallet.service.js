import * as walletRepository from '../repositories/wallet.repository.js'
import * as spRepo from '../repositories/procedures.repository.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'
import { getPagination } from '../utils/pagination.js'

export const getWallets = async (query) => {
    const { limit, offset } = getPagination(query);
    return await walletRepository.findAll({ limit, offset });
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

// Usa SP 4: sp_recargar_billetera (IN/OUT params + manejo de excepciones)
export const rechargeWallet = async (userId, amount) => {
    const result = await spRepo.spRecargarBilletera(userId, amount);
    if (!result.p_success) throw new ValidationError(result.p_mensaje);
}

export const purchaseWallet = async (userId, amount) => {
    if (amount <= 0) throw new ValidationError('Amount must be greater than 0');

    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundError('Wallet not found!');

    const updated = await walletRepository.purchase(amount, userId);
    if (!updated) throw new ValidationError('Cant afford!');

    return updated;
}