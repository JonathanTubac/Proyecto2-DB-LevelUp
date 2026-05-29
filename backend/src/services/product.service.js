import * as productOrmRepo from '../repositories/product.orm.repository.js'
import * as productRepo from '../repositories/product.repository.js'
import * as categoryOrmRepo from '../repositories/category.orm.repository.js'
import * as spRepo from '../repositories/procedures.repository.js'
import { NotFoundError } from '../utils/errors.js'
import { getPagination } from '../utils/pagination.js';

// ORM — Productos (CRUD básico)

export const getProducts = async (query) => {
    const { page, limit, offset } = getPagination(query);
    const { category, name, showAll } = query;
    return await productOrmRepo.findAll({ limit, offset, category, name, showAll: showAll === 'true' });
};

export const getProductById = async (id) => {
    const product = await productOrmRepo.findById(parseInt(id));
    if (!product) throw new NotFoundError('Product not found!');
    return product;
};

export const createProduct = async ({ name, price, stock, id_category }) => {
    const category = await categoryOrmRepo.findById(parseInt(id_category));
    if (!category) throw new NotFoundError('That category doesnt exist!');
    return await productOrmRepo.create({ name, price, stock, id_category });
};

export const updateProduct = async (id, { name, price, stock, id_category }) => {
    const category = await categoryOrmRepo.findById(parseInt(id_category));
    if (!category) throw new NotFoundError('That category doesnt exist!');
    const product = await productOrmRepo.update(parseInt(id), { name, price, stock, id_category });
    if (!product) throw new NotFoundError('Product not found!');
    return product;
};

// SP 2 — sp_desactivar_producto (IN/OUT + excepciones)
export const deactivateProduct = async (id) => {
    const result = await spRepo.spDesactivarProducto(parseInt(id));
    if (!result.p_success) throw new NotFoundError(result.p_mensaje);
};

// SP 3 — sp_activar_producto (IN/OUT + excepciones)
export const activateProduct = async (id) => {
    const result = await spRepo.spActivarProducto(parseInt(id));
    if (!result.p_success) throw new NotFoundError(result.p_mensaje);
};

