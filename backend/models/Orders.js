// models/Orders.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  sessionId: { 
    type: String, 
    unique: true, 
    required: true,
    index: true
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
      },
      title: { type: String, required: true },
      image: String,
      price: { type: Number, required: true, min: 0 },
      salePrice: { type: Number, min: 0 },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
