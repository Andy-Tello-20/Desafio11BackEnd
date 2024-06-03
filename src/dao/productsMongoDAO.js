import ProductModel from '../dao/models/products.model.js'

export default class ProductsMongoDAO {
  static async get()  {
    return await ProductModel.find();
  }
  static async getById(sid) {
    return await ProductModel.findOne({id:sid});
    
    
  }
  static async create(data) {
    return await ProductModel.create(data);
   
    
  }

  static async updateById(sid, data) {
    await ProductModel.updateOne({ _id: sid }, { $set: data });
   
  }

  static async deleteById(sid) {
    await ProductModel.deleteOne({ id: sid });
    
  }

}