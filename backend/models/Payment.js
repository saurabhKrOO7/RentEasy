import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    rental: { type: Schema.Types.ObjectId, ref: "Rental", required: true }, // Other table
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "UPI", "Bank Transfer"],
      required: true,
    },
    transactionStatus: {
      type: String,
      enum: ["Completed", "Failed", "Pending"],
      default: "Pending",
    },
    paymentReferenceId: { type: String, required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
