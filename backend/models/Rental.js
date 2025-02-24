import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Other table
    equipment: {
      // Other table
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    actualReturnDate: { type: Date }, // New field to track when it was actually returned
    overdueDays: { type: Number, default: 0 }, // New field to track late returns
    lateFee: { type: Number, default: 0 }, // Calculated based on overdueDays
    totalCost: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    bookingStatus: {
      type: String,
      enum: ["Confirmed", "Completed", "Cancelled"],
      default: "Confirmed",
    },
    damageReport: { type: String, required: false },
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: false,
    }, // Other table
  },
  { timestamps: true }
);

const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;
