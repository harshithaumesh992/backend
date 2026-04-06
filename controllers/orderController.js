const Order = require("../models/Order");

// Get all orders (for admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get orders by user email
exports.getOrdersByUser = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Initialize status history if not provided
    if (!orderData.statusHistory) {
      orderData.statusHistory = [
        {
          status: 0,
          label: 'Order Placed',
          message: 'Your order has been placed successfully!',
          date: new Date(),
          updatedBy: 'System'
        }
      ];
    }
    
    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Update order status (Admin function)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, statusHistory, expectedDelivery, estimatedDays, lastUpdated } = req.body;

    const updateData = { 
      status,
      lastUpdated: lastUpdated || new Date()
    };
    
    if (statusHistory) updateData.statusHistory = statusHistory;
    if (expectedDelivery) updateData.expectedDelivery = expectedDelivery;
    if (estimatedDays !== undefined) updateData.estimatedDays = estimatedDays;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// Delete an order (Admin function)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
};
