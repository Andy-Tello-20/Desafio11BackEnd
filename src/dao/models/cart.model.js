import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1, required: false },
        
      }
    ],

  },


}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);


