import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoice_id: { type: String, unique: true, required: true },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    }, // Reference to the related Order
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the User who made the order
    total_amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    issue_date: { type: Date, default: Date.now }, // Date when the invoice was issued
    due_date: { type: Date, required: true }, // Date when payment is due
    payment_method: { type: String, required: true }, // Payment method used (e.g., Credit Card, PayPal, etc.)
    transaction_id: { type: String }, // Transaction ID if payment is successful
    invoice_status: {
      type: String,
      enum: ["Unpaid", "Paid", "Overdue"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
