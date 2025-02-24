import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    order_id: { type: String, unique: true, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        rental_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Rental",
        },
        quantity: { type: Number, required: true, default: 1 }, // Quantity of the product/rental
        price: { type: Number, required: true }, // Price of the individual item
      },
    ],
    order_status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Returned"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    total_amount: { type: Number, required: true }, // Total for all items in the order
    deliveryDate: { type: Date },
    completionDate: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
