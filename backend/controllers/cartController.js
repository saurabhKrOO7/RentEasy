import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getCartItem = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated request

    // Fetch the cart for the authenticated user
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res
        .status(404)
        .json({ message: "No cart items found for this user" });
    }

    res.status(200).json(cart.products); // Respond with the products in the cart
  } catch (error) {
    console.error("Error in getCartItem:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

const addToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, quantity, rentalRate } = req.body;
    if (!productId || !quantity || !rentalRate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity, rentalRate }],
      });
    } else {
      // If the cart exists, check if the product already exists in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex >= 0) {
        // If product exists, update the quantity
        cart.products[productIndex].quantity += quantity;
        cart.products[productIndex].rentalRate = rentalRate;
      } else {
        cart.products.push({ productId, quantity, rentalRate });
      }
    }

    await cart.save(); // Save the updated or newly created cart
    res.status(200).json(cart); // Respond with the updated cart
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteFromCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from authenticated user
    const { productId } = req.params; // Extract product ID from route params
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    // Check if the product exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from authenticated user
    const { productId: id } = req.params; // Extract product ID from route params
    const { quantity } = req.body; // Extract updated quantity from request body
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    // Check if the product exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item._id.toString() === id.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Update the quantity of the product
    cart.products[productIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { getCartItem, addToCart, deleteFromCart, updateCart };
