import SellerEarning from "../models/SellerEarning.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getSellerEarnings = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Fetch seller earnings from the database
    const sellerEarnings = await SellerEarning.find({ seller: sellerId });

    if (!sellerEarnings || sellerEarnings.length === 0) {
      return res.status(404).json({ message: "No earnings found." });
    }

    // Calculate total revenue (sum of all earnings)
    const totalRevenue = sellerEarnings.reduce(
      (acc, record) => acc + (record.amount || 0),
      0
    );

    // Calculate pending revenue (only pending payments)
    const pendingRevenue = sellerEarnings
      .filter((record) => record.paymentStatus === "Pending")
      .reduce((acc, record) => acc + (record.amount || 0), 0);

    res.status(200).json({
      totalRevenue, // Total revenue earned
      pendingRevenue, // Revenue that is still pending
      transactions: sellerEarnings,
    });
  } catch (error) {
    console.error("Error fetching seller earnings:", error);
    res.status(500).json({ message: "Failed to retrieve earnings." });
  }
});

const getSellerEarningsByDate = asyncHandler(async (req, res) => {
  const sellerEarnings = await SellerEarning.find({
    date: {
      $gte: req.query.startDate,
      $lte: req.query.endDate,
    },
  });
  res.json(sellerEarnings);
});

const getSellerEarningsByMonth = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.user._id; // Get seller ID from authenticated request
    const year = parseInt(req.params.year, 10); // Convert year to number
    const sellerEarnings = await SellerEarning.aggregate([
      {
        $match: {
          seller: sellerId, // Filter for the logged-in seller
          createdAt: {
            $gte: new Date(`${year}-01-01`), // Start of the year
            $lte: new Date(`${year}-12-31`), // End of the year
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } }, // Extract month from createdAt
          revenue: { $sum: "$amount" }, // Sum up earnings for that month
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          revenue: 1,
        },
      },
      { $sort: { month: 1 } }, // Ensure results are sorted by month
    ]);

    res.json(sellerEarnings);
  } catch (error) {
    console.error("Error fetching seller earnings by month:", error);
    res.status(500).json({ message: "Failed to retrieve earnings." });
  }
});

const showAllOrdersOfSeller = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Step 1: Get all product IDs owned by the seller
    const sellerProducts = await Product.find({ owner: sellerId }).select(
      "_id"
    );
    const sellerProductIds = sellerProducts.map((product) => product._id);

    if (sellerProductIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for your products." });
    }

    // Step 2: Find all orders containing these products
    const orders = await Order.find({
      "items.product_id": { $in: sellerProductIds },
    })
      .populate("user_id", "name email") // Populate buyer details
      .populate("items.product_id", "name price owner") // Populate product details including owner
      .sort({ createdAt: -1 }); // Sort by latest orders

    // Step 3: Filter out products that do not belong to the seller
    const filteredOrders = orders
      .map((order) => {
        // Keep only the seller's products in the order
        const filteredItems = order.items.filter(
          (item) => item.product_id.owner.toString() === sellerId.toString()
        );

        // Return order with only relevant items
        return filteredItems.length > 0
          ? { ...order.toObject(), items: filteredItems }
          : null;
      })
      .filter(Boolean); // Remove null values (orders with no relevant products)

    res.status(200).json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const approveOrder = asyncHandler(async (req, res) => {
  const orderId = req.params._id;
  const sellerId = req.user._id; // Logged-in seller

  // Fetch the order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  // Extract product IDs from order items
  const productIds = order.items.map((item) => item.product_id);

  // Fetch products to check ownership
  const products = await Product.find({ _id: { $in: productIds } });

  // Ensure the seller owns all products in the order
  const isSellerAuthorized = products.every(
    (product) => product.owner.toString() === sellerId.toString()
  );

  if (!isSellerAuthorized) {
    return res
      .status(403)
      .json({ message: "You are not authorized to modify this order." });
  }

  // Reduce inventory quantity
  for (let item of order.items) {
    const product = products.find(
      (p) => p._id.toString() === item.product_id.toString()
    );

    if (product) {
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}, Required: ${item.quantity}`,
        });
      }

      // Reduce quantity in stock
      product.quantity -= item.quantity;
      await product.save();
    }
  }

  // Update order status
  order.order_status = "Approved";
  await order.save();

  res.status(200).json({ message: `Order Approved successfully.`, order });
});

const rejectOrder = asyncHandler(async (req, res) => {
  const orderId = req.params._id; // Order ID
  const sellerId = req.user._id; // Logged-in seller
  const reason = req.body.reason; // Optional reason for rejection
  const status = "Rejected"; // Default status
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }
  // Extract product IDs from order items
  const productIds = order.items.map((item) => item.product_id);
  // Fetch products to check ownership
  const products = await Product.find({ _id: { $in: productIds } });

  // Ensure the seller owns all products in the order
  const isSellerAuthorized = products.every(
    (product) => product.owner.toString() === sellerId.toString()
  );

  if (!isSellerAuthorized) {
    return res
      .status(403)
      .json({ message: "You are not authorized to modify this order." });
  }

  // Update order status
  order.order_status = status;

  // order.rejection_reason = reason;
  await order.save();
  res.status(200).json({ message: `Order ${status} successfully.`, order });
});

export {
  getSellerEarnings,
  getSellerEarningsByDate,
  showAllOrdersOfSeller,
  approveOrder,
  rejectOrder,
  getSellerEarningsByMonth,
};
