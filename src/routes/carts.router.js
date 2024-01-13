import { Router } from "express";
import { cartsManager } from "../managers/carts.manager.js"
import { productsManager } from "../managers/products.manager.js"

const router = Router();

router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartsManager.findById(cid)
        res.status(200).json({ message: 'Cart found', cart })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = { products: [] }
        const newCart = await cartsManager.createOne(cart)
        res.status(200).json({ message: ' New cart', cart: newCart })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartsManager.findById(cid)
        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        }
        const product = await productsManager.findById(pid);
        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        const prod_idx = cart.products.findIndex( (prod) => prod.product.equals(pid) );
        // Como prod.product son tipo de datos ObjectId de mongoose
        // necesitamos usar .equals() para comparar con otro tipo de dato

        if(prod_idx === -1){
            cart.products.push({product: pid, quantity: 1})
        } else {
            cart.products[prod_idx].quantity++
        }
        
        await cart.save()
        res.status(200).json({ message: 'Product added' })
    } catch (error) {
        res.status(500).json({ error })
    }
})




export default router;