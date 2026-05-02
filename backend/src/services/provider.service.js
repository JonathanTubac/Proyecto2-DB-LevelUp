import * as providerRepo from '../repositories/provider.repository.js'
import { NotFoundError, AppError } from '../utils/errors.js'

export const getProviders = async () => {
    return await providerRepo.findAll();
}

export const getProvider = async (id) => {
    const provider = await providerRepo.findById(id);
    if (!provider) throw new NotFoundError('Provider not found!');

    return provider;
}

export const createProvider = async ({ name }) => {
    const provider = await providerRepo.create({ name });
    if (!provider) throw new AppError('Error creating provider!');

    return provider;
}

export const updateProvider = async (id, { name }) => {
    const updated = await providerRepo.update(id, { name });
    if (!updated) throw new AppError('Error updating provider!');

    return updated;
}

export const deactivateProvider = async (id) => {
    const provider = await providerRepo.findById(id);
    if (!provider) throw new NotFoundError('This provider doesnt exists!');

    return await providerRepo.deactivate(id);

}
