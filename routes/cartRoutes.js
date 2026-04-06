const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");

// Get cart by user ID
router.get("/:userId", controller.getCart);

// Save/update cart
router.post("/", controller.saveCart);

// Add item to cart
router.post("/:userId/items", controller.addItem);

// Remove item from cart
router.delete("/:userId/items/:productId", controller.removeItem);

// Clear cart
router.delete("/:userId", controller.clearCart);

module.exports = router;
