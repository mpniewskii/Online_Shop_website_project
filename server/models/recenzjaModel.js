const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
});

module.exports = mongoose.model('Review', ReviewSchema);