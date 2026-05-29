import * as provideRepo from '../repositories/provide.repository.js'
import * as spRepo from '../repositories/procedures.repository.js'
import { AppError, NotFoundError } from '../utils/errors.js'

export const getAllProvides = async () => {
    return await provideRepo.findAll();
};

// Usa SP 5: sp_registrar_suministro (PROCEDURE con transacción y ROLLBACK explícito)
export const createProvide = async ({id_prov, id_prod, amount}) => {
    try {
        await spRepo.spRegistrarSuministro(id_prov, id_prod, amount);
    } catch (err) {
        throw new NotFoundError(err.message || 'Error al registrar suministro');
    }

    const provide = await provideRepo.findLastByProviderAndProduct(id_prov, id_prod);
    if (!provide) throw new AppError('Error al obtener suministro registrado', 500);
    return provide;
};

export const updateProvide = async (id, {amount}) => {
    const provide = await provideRepo.update(id, {amount});
    if(!provide) throw new NotFoundError('This provide doesnt exist!');

    return provide;
}