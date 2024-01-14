import { Router } from "express";
import { usersManager } from "../managers/users.manager.js";
import { messagesManager } from "../managers/messages.manager.js";

const router = Router();

router.get('/', async (req, res) => {
    const user = req.user
    try {
        if (user) {
            return res.render('home', { user: user })
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
router.get("/chats", async (req, res) => {
    const user = req.user
    const chats = await messagesManager.findAll()
    
    if (user) {
        return res.render('allChats', { user: user , chats})
    } else {
        return res.render('allChats', { chats})
    }
});

router.post("/chats/new", async (req, res) => {
    const { chatTitle } = req.body
    try {
        if(!chatTitle){
            return res.status(400).json({message: 'Some data is missing.'})
        }
        const chats = await messagesManager.createOne({ chats: [], title: chatTitle })
        res.redirect('/chats')
        
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.get("/chat/:cid", async (req, res) => {
    const { cid } = req.params
    const chat = await messagesManager.findByField({ '_id': cid })
    res.render("chat", { chat: chat._id, messages: chat.chats, user: req.user });
});



export default router;