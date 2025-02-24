import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    insuranceCost: { type: Number, required: true },
    coverageDetails: { type: String, required: true },
    insuranceProvider: { type: String, required: true },
  },
  { timestamps: true }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);
export default Insurance;
