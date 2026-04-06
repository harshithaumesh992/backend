const Cart = require("../models/Cart");

// Get cart by user ID
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.json({ userId, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Save/update cart
exports.saveCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find and update or create new cart
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { 
        userId,
        items: items || [],
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(cart);
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Error saving cart' });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const item = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if item already exists
    const existingIndex = cart.items.findIndex(
      i => i.productId === item.productId
    );
    
    if (existingIndex >= 0) {
      // Update quantity
      cart.items[existingIndex].quantity += item.quantity || 1;
    } else {
      // Add new item
      cart.items.push(item);
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [], updatedAt: new Date() },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};
