import * as productRepo from '../repositories/product.repository.js'
import * as categoryRepo from '../repositories/category.repository.js'
import { NotFoundError } from '../utils/errors.js'
import { getPagination } from '../utils/pagination.js';

export const getProducts = async (query) => {
    const { page, limit, offset } = getPagination(query);
    const { category, name } = query;
    
    return await productRepo.findAll({ limit, offset, category, name });
};

export const getProductById = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) throw new NotFoundError('Product not found!');
    return product;
};

export const createProduct = async ({ name, price, stock, id_category }) => {
    const category = await categoryRepo.findById(id_category);
    if (!category) throw new NotFoundError('That category doesnt exist!');

    const product = await productRepo.create({ name, price, stock, id_category });

    return product
};

export const updateProduct = async (id, { name, price, stock, id_category }) => {
    const category = await categoryRepo.findById(id_category);
    if (!category) throw new NotFoundError('That category doesnt exist!');

    const product = await productRepo.update(id, { name, price, stock, id_category });
    if (!product) throw new NotFoundError('Product not found!');

    return product;
};

export const deactivateProduct = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) throw new NotFoundError('Product not found!');

    return await productRepo.deactivate(id);
};