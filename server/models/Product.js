const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productType: { type: String, required: true },
  quantityStock: { type: Number, required: true },
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  brandName: { type: String, required: true },
  images: [{ type: String }],
  exchangeEligibility: { type: String, required: true }, // "Yes" or "No"
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
