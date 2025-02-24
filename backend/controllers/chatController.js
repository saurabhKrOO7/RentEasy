import Chat from "../models/Chat.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/Product.js";

// ✅ Mark messages as seen when fetched
const getChatMessages = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ productId, buyerId: userId });

    if (!chat) {
      return res.json({ messages: [] }); // Return empty if no messages
    }

    // Mark all unseen messages as seen
    chat.messages.forEach((msg) => {
      if (!msg.seenBy.includes(userId)) {
        msg.seenBy.push(userId);
      }
    });

    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Save a new message
const saveChatMessage = asyncHandler(async (req, res) => {
  try {
    const { productId, sender, message } = req.body;
    const buyerId = sender._id; // Buyer ID from sender

    let chat = await Chat.findOne({ productId, buyerId });

    if (!chat) {
      // If no chat exists, create a new one
      chat = await Chat.create({
        productId,
        buyerId,
        messages: [{ sender, message, seenBy: [buyerId] }],
      });
    } else {
      // Append message to existing chat
      chat.messages.push({ sender, message, seenBy: [buyerId] });
      await chat.save();
    }

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const markAsSeen = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ productId, buyerId: userId });

    if (!chat) {
      return res.json({ message: "No chat found" });
    }

    chat.messages.forEach((msg) => {
      if (!msg.seenBy.includes(userId)) {
        msg.seenBy.push(userId);
      }
    });

    await chat.save();

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update seen status" });
  }
});

const getSellerChats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id; // Extract seller ID from authenticated user

  const buyerId = req.params.buyerId;
  const productId = req.params.productId;
  if (!sellerId || !buyerId || !productId) {
    return res
      .status(400)
      .json({ message: "Seller ID, Buyer ID, and Product ID are required" });
  }

  try {
    // Find the chat document that matches the buyer, seller, and product
    const chat = await Chat.findOne({ productId, buyerId })
      .populate({
        path: "productId", // First populate productId
        select: "owner name", // Only get 'owner' and 'name' from Product
        populate: {
          path: "owner", // Now populate 'owner' inside 'productId'
          select: "name email", // Select fields from User
        },
      })
      .populate("buyerId", "name email");

    console.log("Chat:", chat);
    if (!chat) {
      return res.status(200).json([]); // Return an empty array if no chat exists
    }

    res.status(200).json(chat.messages); // Return only messages array
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: error.message });
  }
});

const getUnseenMessages = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.user._id; // Ensure the seller is authenticated

    // Find products belonging to the seller
    const sellerProducts = await Product.find({ owner: sellerId }).select(
      "_id"
    );

    if (!sellerProducts.length) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }

    const productIds = sellerProducts.map((product) => product._id);

    // Find chats related to seller's products where messages have only one user in `seenBy`
    const chats = await Chat.find({
      productId: { $in: productIds }, // Only chats related to the seller’s products
      "messages.seenBy": { $size: 1 }, // Messages seen by only one user
    })
      .populate("productId", "name") // Populate product details
      .populate("buyerId", "name email"); // Populate buyer details

    if (!chats.length) {
      return res.status(404).json({ message: "No unseen messages found" });
    }
    console.log("Unseen messages:");
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching unseen messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export {
  getChatMessages,
  markAsSeen,
  getSellerChats,
  saveChatMessage,
  getUnseenMessages,
};
