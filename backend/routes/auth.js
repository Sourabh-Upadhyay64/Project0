import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body

    // Check if it's admin login
    if (role === 'admin') {
      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = jwt.sign(
          { id: 'admin', username, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        )

        return res.json({
          user: { id: 'admin', username, role: 'admin' },
          token,
        })
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' })
      }
    }

    // Kitchen/Cook login
    const user = await User.findOne({ username, role: { $in: ['kitchen', 'cook'] } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Update user status
    user.isOnline = true
    user.lastActive = new Date()
    await user.save()

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (decoded.id !== 'admin') {
        await User.findByIdAndUpdate(decoded.id, { isOnline: false })
      }
    }
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
