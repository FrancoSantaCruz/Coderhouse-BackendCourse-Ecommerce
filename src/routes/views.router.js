import { Router } from "express";
import { usersManager } from "../managers/users.manager.js";

const router = Router();

router.get('/', async (req, res) => {
    const user = req.user
    try {
        if (user) {
            const ctx = await usersManager.findById(user._id)
            return res.render('home', { user: ctx })
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

export default router;