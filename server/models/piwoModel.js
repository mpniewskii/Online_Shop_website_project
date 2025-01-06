const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deliveryOptions: [{
    type: {
      type: String,
      enum: ['ekspresowa', 'normalna', 'tania'],
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    days: {
      type: Number,
      required: true
    }
  }],
  description: {
    type: String,
    required: true
  },
  extendedDescription: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['kraft', 'komercyjny'],
    required: true
  },
  quantityInStock: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);