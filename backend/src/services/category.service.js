import * as categoryRepo from '../repositories/category.repository.js'
import { NotFoundError } from '../utils/errors.js'
import { getPagination } from '../utils/pagination.js';

export const getCategories = async (query) => {
    const { page, limit, offset } = getPagination(query);
    const { nombre } = query;

    return await categoryRepo.findAll({ limit, offset, nombre });
}

export const getCategoryById = async (id) => {
    const category = await categoryRepo.findById(id);
    if (!category) throw new NotFoundError('Category not found!');

    return category;
}

export const createCategory = async ({ name }) => {
    return await categoryRepo.create({ name });
}

export const updateCategory = async (id, {name}) => {
    const category = await categoryRepo.findById(id);
    if(!category) throw new NotFoundError('Category not found!');

    return await categoryRepo.update(id, {name});
}