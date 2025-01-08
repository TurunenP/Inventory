const express = require("express");
const Order = require("../models/orderModel");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Read all orders
const getAllOrders = async (req, res) => {
  try {
    const order = await Order.find({});
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Read a single order  by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json();
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update an order  by ID
const updateOrderById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "quantity", "price"]; // Add other fields as necessary
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json();
    }

    updates.forEach((update) => (Order[update] = req.body[update]));
    await order.save();
    res.status(200).json(Order);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Delete an order  by ID
const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json();
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
