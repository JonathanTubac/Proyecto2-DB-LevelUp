import * as productService from '../services/product.service.js'

export const getAll = async (req, res, next) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({ success: true, data: products });
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