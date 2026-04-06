const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  phone: String,
  deliveryAddress: String,
  
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      finalPrice: Number
    }
  ],

  total: Number,

  status: {
    type: Number,
    default: 0
  },

  statusHistory: [
    {
      status: Number,
      label: String,
      message: String,
      date: {
        type: Date,
        default: Date.now
      },
      updatedBy: String
    }
  ],

  expectedDelivery: Date,

  estimatedDays: {
    type: Number,
    default: 5
  },

  paymentMethod: String,
  paymentStatus: String,
  paymentId: String,

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
