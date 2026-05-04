import * as productService from '../services/product.service.js'
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
    try {
        const { data, total } = await productService.getProducts(req.query);
        const { page, limit } = getPagination(req.query);

        res.json({ 
            success: true, 
            ...paginatedResponse(data, total, page, limit) 
        });
    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params
        const product = await productService.getProductById(id);
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
}

export const create = async (req, res, next) => {
    try {
        const { name, price, stock, id_category } = req.body;
        const product = await productService.createProduct({ name, price, stock, id_category });
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, stock, id_category } = req.body;
        const product = await productService.updateProduct(id, { name, price, stock, id_category });
        res.status(203).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
}

export const deactivate = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deactivateProduct(id);
        res.status(200).json({ success: true })
    } catch (err) {
        next(err);
    }
}