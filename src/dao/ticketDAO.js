import TicketModel from "./models/ticket.model.js";
import CartModel from "./models/cart.model.js";
import ProductsModel from "./models/products.model.js";
import { logger } from "../utils.js";

export default class TicketMongoDAO {

    static async createTicket(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Cart not found');
            }

            //? aca se guardan los _Ids de los productos que no contaban con suficiente stock
            let failedProducts = [];

            for (const item of cart.products) {
                const product = item.product;
                const quantityInCart = item.quantity;
                const availableStock = product.stock;

                if (quantityInCart <= availableStock) {
                    product.stock -= quantityInCart;

                    //? Actualiza el stock del producto en la base de datos
                    await ProductsModel.findByIdAndUpdate(product._id, { stock: product.stock }); 
                } else {
                    failedProducts.push(product._id);
                }
            }

            if (failedProducts.length > 0) {
                cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
                await cart.save();

                logger.debug(`cart.products es: ${cart.products}`)
          
                logger.debug(`failedProducts es: ${failedProducts}`)
        

                //? Devuelve los IDs de los productos que no pudieron procesarse
                return { failedProducts }; 
            }

            

            const ticket = await TicketModel.create({
                amount:calcularTotalCompra(cart),
                purchaser:'andres@gmail.com'
            })

            logger.debug(`ticket es: ${ticket}`)
        

            

            //! Filtra los productos que no pudieron comprarse y actualiza el carrito
            cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
            await cart.save();

            return ticket
        } catch (err) {
            logger.error(`${err}`)
            throw err; 
        }
    }

}

function calcularTotalCompra(cart) {
    let total = 0;

    //? Recorre los productos en el carrito que tenían suficiente stock
    for (const item of cart.products) {
        const product = item.product;
        const quantityInCart = item.quantity;

        // Verifica si el producto tenía suficiente stock
        if (product.stock >= quantityInCart) {
            const subtotal = product.price * quantityInCart;
            total += subtotal;
        }
    }

    return total;
}