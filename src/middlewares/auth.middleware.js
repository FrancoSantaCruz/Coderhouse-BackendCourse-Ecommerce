import { usersManager } from "../managers/users.manager.js";

export const authValidation = async (req, res, next) => {
    try {
        if( req.session.hasOwnProperty('passport') ){
            const id = req.session.passport.user
            const user = await usersManager.findById(id)
            console.log(user)
        } else {
            return res.redirect('/login')
        }
        next();
    } catch (error) {
        res.status(500).json( { error })
    }
}