import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
// Files
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import cartRoute from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { sendReceiptEmail } from "./config/sendEmail.js";
import { contactMessage } from "./config/contactMessage.js";
import Chat from "./models/Chat.js";
import Product from "./models/Product.js";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

// Create an HTTP server
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true, // Required to allow cookies or authentication headers
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/cart", cartRoute);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.post("/api/send-email", sendReceiptEmail);
app.post("/api/contact", contactMessage);

// For uploading the image in uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// 🔹 Setup Socket.io for real-time chat

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a chat room (for a specific product)
  socket.on("joinRoom", ({ productId }) => {
    socket.join(productId);
  });

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    console.log("Message received in Backend:", data); // Debugging

    try {
      // Extract required fields
      const { productId, sender, message } = data;
      const buyerId = sender._id;
      const sellerId = await Product.findById(productId).select("seller");

      // Emit message to the product room
      io.to(productId).emit("message", { sender, message });

      // Emit notification to seller (if sellerId exists)
      if (sellerId) {
        io.to(sellerId).emit("newMessage", {
          buyerId,
          buyerName: sender.name,
          message,
        });

        console.log("Emitted newMessage to Seller:", {
          buyerId,
          buyerName: sender.name,
          message,
        });
      } else {
        console.warn(
          "Seller ID is undefined. Cannot send new message notification."
        );
      }
      // ✅ Emit message back to the sender (buyer)
      io.to(socket.id).emit("message", { sender, message });
    } catch (error) {
      console.error("Failed to save message", error);
    }
  });

  // mark as seen
  socket.on("markAsSeen", async ({ room, userId }) => {
    await Chat.updateMany(
      { productId: room, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    io.to(room).emit("messagesSeen", { room, userId });
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
server.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});
