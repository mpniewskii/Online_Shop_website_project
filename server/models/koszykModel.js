const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true }
      }
    ],
    deliveryMethod: { type: String },
    deliveryAddress: { type: String },
    deliveryCost: { type: Number }
});

module.exports = mongoose.model('Cart', CartSchema);