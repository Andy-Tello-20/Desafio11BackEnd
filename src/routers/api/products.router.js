import { Router } from 'express'
import passport from 'passport'
import ProductsController from '../../controllers/product.controller.js'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'
import { faker } from '@faker-js/faker';



const router = Router()

router.get('/products', ProductsController.getProducts
   )

 router.post('/products', passport.authenticate('current', { session: false, failureRedirect: '/login' }) ,authRolesMiddleware('admin') ,ProductsController.createProduct)

 router.get('/products/:sid', ProductsController.getProductById)

 router.put('/products/:uid', passport.authenticate('current', { session: false, failureRedirect: '/login' }) ,authRolesMiddleware('admin') ,ProductsController.updateProduct)

 router.post('/product/:uid', passport.authenticate('current', { session: false, failureRedirect: '/login' }) ,authRolesMiddleware('admin') ,ProductsController.deleteProduct)

 router.get('/mockingproducts', (req, res) => {
  try {
    const productos = [];

    for (let i = 0; i < 100; i++) {
      const producto = {
        _id: faker.datatype.uuid(),
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        code: faker.datatype.number(),
        price: faker.datatype.float({ min: 10, max: 1000, precision: 0.01 }),
        status: 'available',
        stock: faker.datatype.number({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: faker.image.imageUrl(),
      };

      productos.push(producto)
    }

    res.json(productos)
  } catch (error) {
    res.status(500).send('Error al generar productos ficticios')
  }
})


export default router