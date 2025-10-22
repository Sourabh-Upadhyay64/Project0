import express from 'express'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'

const router = express.Router()

// Get all active orders (not delivered or cancelled)
router.get('/active', async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['pending', 'preparing', 'prepared'] },
    }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query
    const filter = {}
    
    if (status) {
      filter.status = status
    }
    
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create order
router.post('/', async (req, res) => {
  try {
    const { tableNumber, items, customerPhone } = req.body

    // Generate order number
    const count = await Order.countDocuments()
    const orderNumber = `ORD${String(count + 1).padStart(5, '0')}`

    // Calculate total and update inventory
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId)
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.name} not found` })
      }

      if (!menuItem.available || menuItem.inventoryCount < item.quantity) {
        return res.status(400).json({
          message: `${menuItem.name} is not available or insufficient stock`,
        })
      }

      // Update inventory
      menuItem.inventoryCount -= item.quantity
      await menuItem.save()

      totalAmount += menuItem.price * item.quantity
      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions || '',
      })
    }

    const order = new Order({
      orderNumber,
      tableNumber,
      customerPhone,
      items: orderItems,
      totalAmount,
      status: 'preparing',
    })

    await order.save()

    // Emit socket event for new order
    const io = req.app.get('io')
    io.emit('new-order', order)

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Emit socket event for order update
    const io = req.app.get('io')
    io.emit('order-updated', order)

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
