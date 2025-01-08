// order routes

const express = require("express");

const router = express.Router();
const {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
} = require("../controllers/orderController");

router.post("/order-items", createOrderItem);
router.get("/order-items", getAllOrderItems);
router.get("/order-items/:id", getOrderItemById);
router.patch("/order-items/:id", updateOrderItemById);
router.delete("/order-items/:id", deleteOrderItemById);

module.exports = router;
