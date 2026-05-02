import * as provideRepo from '../repositories/provide.repository.js'
import * as providerRepo from '../repositories/provider.repository.js'
import * as productRepo from '../repositories/product.repository.js'
import { AppError, NotFoundError } from '../utils/errors.js'

export const getAllProvides = async () => {
    return await provideRepo.findAll();
};

export const createProvide = async ({id_prov, id_prod, amount}) => {
    const provide = await provideRepo.create({id_prov, id_prod, amount});
    if(!provide) throw new AppError('Cant create provide!');

    const product = await productRepo.findById(id_prod);
    if(!product) throw new NotFoundError('That product doesnt exist!');

    const provider = await providerRepo.findById(id_prov);
    if(!provider) throw new NotFoundError('That provider doesnt exist!')
        
    return provide;
};