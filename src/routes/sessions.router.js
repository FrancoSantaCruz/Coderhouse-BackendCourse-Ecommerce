import { Router } from "express";
import passport from "passport";

const router = Router();


router.get('/current', async(req, res) => {
    
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
    req.session.destroy( () => {
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