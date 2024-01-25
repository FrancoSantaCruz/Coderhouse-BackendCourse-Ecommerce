import { Router } from "express";
import { usersManager } from "../managers/users.manager.js";
import { messagesManager } from "../managers/messages.manager.js";
import { productsManager } from "../managers/products.manager.js";

import { authValidation } from "../middlewares/auth.middleware.js";
import { roleValidation } from "../middlewares/role.middleware.js";

const router = Router();

router.get('/', async (req, res) => {
    const user = req.user
    try {
        if (user) {
            let cart_total = 0
            user.cart.products.forEach(e => {
                cart_total += e.product.price
            })
            return res.render('home', { user: user, cart_total: cart_total })
        } else {
            return res.render('home')
        }
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.get('/login', async (req, res) => {
    res.render('login')
});

router.get('/signup', async (req, res) => {
    res.render('signup')
});


// CHATS VIEWS
router.get("/chats", authValidation, async (req, res) => {
    const user = req.user
    const chats = await messagesManager.findAll()

    if (user) {
        return res.render('allChats', { user: user, chats })
    } else {
        return res.render('allChats', { chats })
    }
});

router.post("/chats/new", async (req, res) => {
    const { chatTitle } = req.body
    try {
        if (!chatTitle) {
            return res.status(400).json({ message: 'Some data is missing.' })
        }
        const chats = await messagesManager.createOne({ chats: [], title: chatTitle })
        res.redirect('/chats')

    } catch (error) {
        res.status(500).json({ error })
    }
});

router.get("/chat/:cid", authValidation, async (req, res) => {
    const { cid } = req.params
    const chat = await messagesManager.findByField({ '_id': cid })
    res.render("chat", { chat: chat._id, messages: chat.chats, user: req.user });
});

// PRODUCTS VIEW
// All products
router.get('/products', async (req, res) => {
    const user = req.user
    try {
        const products = await productsManager.findAllPg(req.query)
        products.payload.forEach(e => {
            if (e.sale) {
                e["sale_price"] = e.price - (Math.round(e.price * (e.sale_percent / 100)))
            }
        });
        if (user) {
            let cart_total = 0
            user.cart.products.forEach(e => {
                cart_total += e.product.price
            })
            return res.render('products_all', { products: products.payload, info: products, user: user, cart_total: cart_total })
        }
        res.render('products_all', { products: products.payload, info: products, user: user })
    } catch (error) {
        res.redirect(500, '/error')
    }
})

// Product detail
router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const user = req.user;
    try {
        const product = await productsManager.findById(pid)
        if(user){
            let cart_total = 0
            user.cart.products.forEach(e => {
                cart_total += e.product.price
            })
            return res.render('products_detail', { product, user, cart_total})
        }
        res.render('products_detail', { product })
    } catch (error) {
        res.redirect(500, '/error')
    }
})




export default router;