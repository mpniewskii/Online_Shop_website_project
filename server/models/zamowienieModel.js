const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ],
    deliveryDetails: {
        name: { type: String },
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
        email: { type: String } // Nowe pole
    },
    deliveryMethod: { type: String },
    deliveryType: { type: String }, // Nowe pole
    deliveryCost: { type: Number },
    totalCost: { type: Number },
    finalCost: { type: Number },
    confirmed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', OrderSchema);