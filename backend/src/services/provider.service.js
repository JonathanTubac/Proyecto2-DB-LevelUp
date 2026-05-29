import * as providerRepo from '../repositories/provider.orm.repository.js'
import { NotFoundError, AppError } from '../utils/errors.js'
import { getPagination } from '../utils/pagination.js';

// ORM — Proveedores

export const getProviders = async (query) => {
    const { page, limit, offset } = getPagination(query);
    const { nombre, showAll } = query;
    return await providerRepo.findAll({ limit, offset, nombre, showAll: showAll === 'true' });
}

export const getProvider = async (id) => {
    const provider = await providerRepo.findById(parseInt(id));
    if (!provider) throw new NotFoundError('Provider not found!');
    return provider;
}

export const createProvider = async ({ name }) => {
    const provider = await providerRepo.create({ name });
    if (!provider) throw new AppError('Error creating provider!');
    return provider;
}

export const updateProvider = async (id, { name }) => {
    const updated = await providerRepo.update(parseInt(id), { name });
    if (!updated) throw new AppError('Error updating provider!');
    return updated;
}

export const deactivateProvider = async (id) => {
    const provider = await providerRepo.findById(parseInt(id));
    if (!provider) throw new NotFoundError('This provider doesnt exists!');
    return await providerRepo.deactivate(parseInt(id));
};

export const activateProvider = async (id) => {
    const provider = await providerRepo.findById(parseInt(id));
    if (!provider) throw new NotFoundError('This provider doesnt exists!');
    return await providerRepo.activate(parseInt(id));
};
