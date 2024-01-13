import { Router } from "express";
import { usersManager } from '../managers/users.manager.js'
import { cartsManager } from "../managers/carts.manager.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const allUsers = await usersManager.findAll();
        res.status(200).json({ message: ' All users ', allUsers })
    } catch (error) {
        res.status(500).json({ error })
    }
})

// router.get('/:uid', async (req, res) => {
//     const { uid } = req.params;
//     try {
//         const user = usersManager.findById(uid);
//         res.status(200).json({ message: ' User found ', user })
//     } catch (error) {
//         res.status(500).json({ error })
//     }
// })

router.post('/', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Some data is missing' });
    }
    try {
        const newCart = await cartsManager.createOne({ products: [] });
        const newUser = await usersManager.createOne({ ...req.body, cart: newCart._id })
        // res.redirect(`/home/${newUser._id}`)
        res.redirect('/')
    } catch (error) {
        res.status(500).json({ error })
    }
})


router.get('/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await usersManager.findByEmail(email);
        res.status(200).json({ message: ' User found ', user })
    } catch (error) {
        res.status(500).json({ error })
    }
})

// router.get('/', async (req, res) => {
//     try {



//         res.status(200).json({ message })      
//     } catch (error) {
//         res.status(500).json({ error })
//     }
// })




export default router;