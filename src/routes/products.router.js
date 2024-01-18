import { Router } from "express";
import { productsManager } from "../managers/products.manager.js";

const router = Router();


router.get('/', async (req, res) => {
    try {
        const products = await productsManager.findAllProducts(req.query);
        res.status(200).json({ message: 'Products founded', products })
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.query
    try {
        const product = await productsManager.findById(pid)
        res.status(200).json({ message: 'Product found', product })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/new', async (req, res) => {
    const { title, description, code, price, status, stock, category, sale, sale_percent } = req.body
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Some data is missing' });
    }
    try {
        const prod = {
            title: title,
            description: description,
            code: code,
            price: price,
            status: status? "true" : "false",
            stock: stock,
            category: category,
            sale: sale? "true" : "false",
            sale_percent : sale_percent ? sale_percent : 0,
        }
        const product = await productsManager.createOne(prod)
        res.status(200).json({ message: ' Product created ', product })
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.query
    try {
        const product = await productsManager.deleteOne(pid)
        res.status(200).json({ message: 'Product deleted', product })
    } catch (error) {
        res.status(500).json({ error })
    }
})

export default router;