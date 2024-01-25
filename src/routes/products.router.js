import { Router } from "express";
import { productsManager } from "../managers/products.manager.js";

import { authValidation } from "../middlewares/auth.middleware.js";
import { roleValidation } from "../middlewares/role.middleware.js";

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

// , authValidation, roleValidation
router.post('/new', async (req, res) => {
    const { title, description, price, status, stock, category, sale, sale_percent } = req.body
    if (!title || !description || !price || !stock || !category) {
        return res.status(400).json({ message: 'Some data is missing' });
    }
    try {

        // code generator
        let rdm_code = ""
        let random = 0
        for(let i=0 ; i<5 ; i++){
            random = Math.floor(Math.random() * title.length)
            rdm_code = rdm_code.concat(random)
        }

        const prod = {
            title: title,
            description: description,
            code: rdm_code,
            price: price,
            status: status? "false" : "true",
            stock: stock,
            category: category,
            sale: sale? "true" : "false",
            sale_percent : sale_percent ? sale_percent : 0,
        }
        const product = await productsManager.createOne(prod)
        res.redirect('/products')
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.delete('/delete/:pid', async (req, res) => {
    const { pid } = req.params;
    console.log(pid);
    try {
        const product = await productsManager.deleteOne(pid)
        res.status(200).json({ message: 'Product deleted', product })
    } catch (error) {
        res.status(500).json({ error })
    }
})

export default router;