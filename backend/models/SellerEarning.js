import mongoose from "mongoose";

const sellerEarningsSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    }, // Earnings from this rental transaction

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    transactionId: {
      type: String,
      default: null,
    }, // Reference to actual payment (e.g., Stripe/PayPal)

    payoutDate: {
      type: Date,
      default: null,
    }, // When the seller gets paid (null if pending)
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt fields
);

sellerEarningsSchema.index({ createdAt: 1 });

const SellerEarning = mongoose.model("SellerEarning", sellerEarningsSchema);
export default SellerEarning;
