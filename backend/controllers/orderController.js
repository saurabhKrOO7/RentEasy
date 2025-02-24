import Order from "../models/Order.js";
import Rental from "../models/Rental.js";
import Product from "../models/Product.js";
import Insurance from "../models/Insurance.js";
import Log from "../models/Log.js";
import Cart from "../models/Cart.js";
import SellerEarning from "../models/SellerEarning.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const { user_id, paymentMethod } = req.body;

  if (!user_id || !paymentMethod) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  const cart = await Cart.findOne({ userId: user_id }).populate(
    "products.productId"
  );

  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: "Cart is empty or not found." });
  }

  // **Step 1: Check if all products belong to the same seller**
  const uniqueSellers = new Set();
  for (const item of cart.products) {
    if (item.productId) {
      uniqueSellers.add(item.productId.owner.toString());
    }
  }

  if (uniqueSellers.size > 1) {
    return res.status(400).json({
      message:
        "You can only place an order with products from the same seller.",
    });
  }

  let totalAmount = 0;
  const rentalRecords = [];
  const orderItems = [];
  const sellerEarningsUpdates = [];

  const sellerId = [...uniqueSellers][0]; // Get the single seller ID

  for (const item of cart.products) {
    const { productId, quantity, rentalRate } = item;
    const product = item.productId;

    if (!product || !product.availability) {
      return res.status(404).json({
        message: `Product with ID ${item.productId} is not available.`,
      });
    }

    let rentalDuration, rentalCost;
    switch (rentalRate) {
      case "daily":
        rentalDuration = 1;
        rentalCost = product.rentalRate.daily * quantity;
        break;
      case "weekly":
        rentalDuration = 7;
        rentalCost = product.rentalRate.weekly * quantity;
        break;
      case "monthly":
        rentalDuration = 30;
        rentalCost = product.rentalRate.monthly * quantity;
        break;
      default:
        return res.status(400).json({
          message: `Invalid rental rate for product ID ${product._id}.`,
        });
    }

    let insuranceCost = 0;
    if (product.insuranceStatus) {
      const insurance = await Insurance.findOne({ equipment: product._id });
      if (insurance) {
        insuranceCost = insurance.insuranceCost * quantity;
      }
    }

    const itemTotal = rentalCost + insuranceCost;
    totalAmount += itemTotal;

    // Create a rental transaction
    const rental = await Rental.create({
      renter: user_id,
      equipment: product._id,
      rentalStartDate: new Date(),
      rentalEndDate: new Date(
        Date.now() + rentalDuration * 24 * 60 * 60 * 1000
      ),
      totalCost: rentalCost,
      paymentStatus: "Pending",
      bookingStatus: "Confirmed",
    });
    rentalRecords.push(rental);

    orderItems.push({
      product_id: product._id,
      rental_id: rental._id,
      quantity,
      rentalRate,
      rentalCost,
      insuranceCost,
      price: rentalCost + insuranceCost,
      total: itemTotal,
    });

    // Prepare seller earnings update
    sellerEarningsUpdates.push({
      updateOne: {
        filter: { seller: product.owner, rental: rental._id }, // Ensure unique rental tracking
        update: {
          $setOnInsert: {
            seller: product.owner,
            rental: rental._id,
            amount: rentalCost,
            paymentStatus: "Pending",
          },
        },
        upsert: true,
      },
    });
  }

  try {
    // Create Order
    const order = await Order.create({
      order_id: `ORD-${Date.now()}`,
      user_id,
      seller_id: sellerId, // Store seller ID
      items: orderItems,
      order_status: "Pending",
      payment_status: "Pending",
      paymentMethod,
      total_amount: totalAmount,
      isApproved: false,
    });

    // Log Order Creation
    await Log.create({
      user: user_id,
      action: `Created order ${order.order_id} with multiple items.`,
    });

    // Clear the User's Cart
    await Cart.findOneAndUpdate({ userId: user_id }, { products: [] });

    // Batch update Seller Earnings
    if (sellerEarningsUpdates.length > 0) {
      await SellerEarning.bulkWrite(sellerEarningsUpdates);
    }

    res.status(201).json({
      message: "Order created successfully.",
      order,
      rentalRecords,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user_id");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user_id");
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.payment_status = "Paid";
      await order.save();
      res.status(200).json({ message: "Order marked as paid." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.order_status = "Approved";
      await order.save();
      res.status(200).json({ message: "Order Approved." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const countTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const countTotalSales = asyncHandler(async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]);
    res.status(200).json({ totalSales: totalSales[0].total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const totalSales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]);
    res.status(200).json({ totalSales: totalSales[0].total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  countTotalOrders,
  countTotalSales,
  calculateTotalSalesByDate,
};
