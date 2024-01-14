import { Router } from "express";
import passport from "passport";

const router = Router();


router.get('/current', async (req, res) => {
    const user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role,
    }
    return res.json(user)
})

router.post('/signup', passport.authenticate('signup',
    {
        successRedirect: '/',
        failureRedirect: '/error'
    }
))

router.post('/login', passport.authenticate('login',
    {
        successRedirect: '/',
        failureRedirect: '/error'
    }
))

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.get('/auth/google',
    passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get('/auth/google/callback',
    passport.authenticate('google',
        {
            failureRedirect: '/login',
        }
    ),
    function (req, res) {
        res.redirect('/')
    }
);




export default router;