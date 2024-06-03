import {cartService}  from "../services/CartServices.js";
import { logger } from "../utils.js";

export default class CartsController {



    static createCart = async (req, res) => {

        try {
            const newCart = {
                products: []
            }

            const response = await cartService.create(newCart)

            res.status(201).json(response)

        } catch (error) {
            logger.error(`error al crear el carrito ${error}`)
            
            res.status(500).json({ error: 'Error interno del servidor' })
        }


    }

    static getCartById = async (req, res) => {

        try {
            const idcart = req.params.cid
    
            if (idcart) {
    
    
                const showCart = await cartService.findCart(idcart)

                if (!showCart) {
                    throw new Error('Producto no encontrado.');
                }

    
                res.status(201).json(showCart)
    
            } else {
                res.send({ error: 'No se proporcionó un PID válido' })
            }
    
        } catch (error) {
            logger.error(`${error}`)
            res.status(500).json({ error: 'Error interno del servidor' })
        }
    
    }

    static addProduct = async (req, res) => {

        try {
            const carritoId = req.params.cid
            const productoId = req.params.pid

            logger.debug(`carritoId y productoId son: ${carritoId} , ${productoId}`)

    
            const productoEncontrado = await cartService.addProduct(carritoId,productoId)
    
            res.status(200).json(productoEncontrado)
            
    
        } catch (error) {
            logger.error(`${error}`)
            res.status(500).json({ error: 'Error interno del servidor' })
        }
    }

    static purchase = async (req, res) => {
            try {
                const cartId = req.params.cid;
        

                const {email} = req.user

                logger.debug(`${email}`)
                

                const compra = await cartService.ticket(cartId)
                

                res.json({ message: 'Purchase successful', compra });
            } catch (err) {
                logger.error(`${err}`)
               
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }


    

}