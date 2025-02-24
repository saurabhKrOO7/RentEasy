import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addProductToWishlist = asyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: "Product added to wishlist" });
    } else {
      res.json({ message: "Product already in wishlist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

const removeProductFromWishlist = asyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (user.wishlist.includes(productId)) {
      user.wishlist.pull(productId);
      await user.save();
      res.json({ message: "Product removed from wishlist" });
    } else {
      res.json({ message: "Product not in wishlist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error removing from wishlist" });
  }
});

const getProductFromWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving wishlist" });
  }
});

export {
  addProductToWishlist,
  removeProductFromWishlist,
  getProductFromWishlist,
};
