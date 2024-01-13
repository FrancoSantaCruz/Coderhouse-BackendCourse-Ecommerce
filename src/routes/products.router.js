import { Router } from "express";
import { productsManager } from "../managers/products.manager.js";
const router = Router();


router.post('/', async (req, res) => {
    const { name, price, stock } = req.body
    if( !name || !price || !stock ){
        return res.status(400).json({message: 'Some data is missing'});
    }
    try {
        const product = await productsManager.createOne(req.body)
        res.status(200).json({ message: ' Product created ', product})      
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/', async(req, res) => {
    const products = await productsManager.findAllProducts(req.query);
    res.json({products})
})





export default router;