const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

// Get all orders (for admin)
router.get("/", controller.getOrders);

// Get orders by user email
router.get("/user/:email", controller.getOrdersByUser);

// Get single order by ID
router.get("/:id", controller.getOrderById);

// Create a new order
router.post("/", controller.createOrder);

// Update order status (Admin function)
router.put("/:id", controller.updateOrderStatus);

// Delete an order (Admin function)
router.delete("/:id", controller.deleteOrder);

module.exports = router;
