import ProductsMongoDAO from "../dao/productsMongoDAO.js";
import { logger } from "../utils.js";

export default class HomeController {
    static getIndex = async (req, res) => {
        try {
            logger.debug(`req.user : ,${JSON.stringify(req.user, null, 2)}`)
            if (!req.user) {
                return res.redirect('/login')
            }

            const products = await ProductsMongoDAO.get()


            res.status(200).render('profile', { title: 'products', user: req.user, cartId: req.user.cart, listProducts: products.map(p => p.toJSON()) })

        } catch (error) {
            logger.error(`Error al obtener los productos: ${error}`)
            res.status(500).render('error', { error: 'Error al obtener los productos' });
        }
    }
}