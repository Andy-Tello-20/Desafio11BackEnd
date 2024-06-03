import CartModel from './models/cart.model.js'
import { logger } from '../utils.js';

export default class CartMongoDAO {

    static async createCart(data) {
        const product = await CartModel.create(data);

       logger.debug(`Producto creado correctamente (${product._id}) `)


        return product;
    }


    static async getCart() {
        try {
            const cart = await CartModel.find({});
            return cart;
        } catch (error) {
            logger.error(`Error al obtener el carrito:, ${error}`)
            throw error;
        }
    }


    static async getCartById(sid) {
        return await CartModel.findById(sid);


    }

    

    static async addProductToCart(idCart, idProducto) {
        try {
            // Buscar el carrito y popular los productos
            let carritoEncontrado = await CartModel.findById(idCart).populate('products.product');
    
           
    
            if (!carritoEncontrado) {
                throw new Error('Carrito no encontrado');
            }
    
            // Verificar si el producto ya existe en el carrito
            const existingProductIndex = carritoEncontrado.products.findIndex(i => {
                // Comparar correctamente el _id del producto, independientemente de si está poblado o no
                return (i.product._id ? i.product._id.toString() : i.product.toString()) === idProducto.toString();
            });
    
            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, aumentar la cantidad en una unidad
                carritoEncontrado.products[existingProductIndex].quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo como nuevo
                carritoEncontrado.products.push({ product: idProducto, quantity: 1 });
            }
    
            // Guardar el carrito actualizado
            await carritoEncontrado.save();
    
            // Repoblar para devolver el carrito actualizado con productos completos
            carritoEncontrado = await CartModel.findById(idCart).populate('products.product');

            return carritoEncontrado;
        } catch (error) {
            logger.error(`Error al agregar producto al carrito:, ${error}`)
            throw error;
        }
    }
    

    static async updateCartById(sid, data) {
        await CartModel.updateOne({ _id: sid }, { $set: data });
        logger.debug(`Producto actualizado correctamente ${sid} `)
    }

    static async deleteCartById(sid) {
        await CartModel.deleteOne({ _id: sid });
        logger.debug(`Carrito eliminado correctamente (${sid}) `)
    }

}

