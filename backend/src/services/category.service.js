import * as categoryRepo from '../repositories/category.repository.js'
import { NotFoundError } from '../utils/errors.js'

export const getCategories = async () => {
    return await categoryRepo.findAll();
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