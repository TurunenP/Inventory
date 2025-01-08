const express = require("express");
const Order = require("../models/orderModel"); // Assuming you have an OrderItem model

// Create a new order item
const createOrderItem = async (req, res) => {
  try {
    const orderItem = new OrderItem(req.body);
    await orderItem.save();
    res.status(201).send(orderItem);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read all order items
const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({});
    res.status(200).send(orderItems);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Read a single order item by ID
const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id);
    if (!orderItem) {
      return res.status(404).send();
    }
    res.status(200).send(orderItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update an order item by ID
const updateOrderItemById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "quantity", "price"]; // Add other fields as necessary
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const orderItem = await OrderItem.findById(req.params.id);
    if (!orderItem) {
      return res.status(404).send();
    }

    updates.forEach((update) => (orderItem[update] = req.body[update]));
    await orderItem.save();
    res.status(200).send(orderItem);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete an order item by ID
const deleteOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndDelete(req.params.id);
    if (!orderItem) {
      return res.status(404).send();
    }
    res.status(200).send(orderItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports = {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
};
