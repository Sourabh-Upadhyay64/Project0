import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  customerPhone: {
    type: String,
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    name: String,
    quantity: Number,
    price: Number,
    specialInstructions: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'prepared', 'delivered', 'cancelled'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
}, {
  timestamps: true,
})

export default mongoose.model('Order', orderSchema)
