const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user profile (protected route)
router.get('/profile', auth, (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (protected route)
router.put('/profile', auth, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Update user data (implement with database)
    const updatedUser = {
      ...req.user,
      name: name || req.user.name,
      phone: phone || req.user.phone,
      address: address || req.user.address
    };

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
