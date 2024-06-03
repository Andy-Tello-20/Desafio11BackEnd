import { Router } from 'express'
import passport from 'passport'
import CartsController from '../../controllers/cart.controller.js'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'

const router = Router()



router.post('/carts',CartsController.createCart )


router.get('/carts/:cid', CartsController.getCartById )


router.post('/carts/:cid/product/:pid', passport.authenticate('current', { session: false, failureRedirect: '/login' }),authRolesMiddleware('user'), CartsController.addProduct)

router.post('/:cid/purchase', passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('user'), CartsController.purchase);

export default router