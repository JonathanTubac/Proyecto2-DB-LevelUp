import * as categoryService from '../services/category.service.js'

export const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);

        res.status(200).json({ success: true, data: category })
    } catch (err) {
        next(err)
    }
};

export const create = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategory({name});
        res.status(201).json({success:true, data: category});
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const category = await categoryService.updateCategory(id, {name});
        res.status(200).json({success:true, data: category});
    } catch (err){
        next(err);
    }
}