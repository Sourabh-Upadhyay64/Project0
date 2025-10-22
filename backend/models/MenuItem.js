import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  inventoryCount: {
    type: Number,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
  },
}, {
  timestamps: true,
})

export default mongoose.model('MenuItem', menuItemSchema)
