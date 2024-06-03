// import DAO from "../dao/cartMongoDAO.js";
// import DAO from "../dao/cartFsDAO.js";


import { DAO } from "../dao/factory.js";
import TicketMongoDAO from "../dao/ticketDAO.js";



class CartService {
    constructor(dao) {
        this.dao = dao; // Instancia el DAO MongoDB o FsDAO
    }

     async create(newCart) {
        const crear= await this.dao.createCart(newCart);


        return crear
        
    }

    async findCart (id){

        const Cart = await this.dao.getCartById(id)

        return Cart

    }

    async addProduct (idCart,idProducto){
        const productoEncontrado = await this.dao.addProductToCart(idCart,idProducto)
        

        if (productoEncontrado) {

          
            return productoEncontrado

        } else {

            const mensaje = "no se encontro ningun producto 😪"

            return mensaje
        }
    }
    
    async ticket (id){
         const retornoTicket = await TicketMongoDAO.createTicket(id) 

         return retornoTicket

         
    }
}

 export const cartService = new CartService(DAO);

 