const { Schema } = mongoose;
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["seller", "buyer", "admin"],
      default: "buyer",
    },
    profilePicture: { type: String, required: false },
    address: { type: String, required: false },
    paymentInfo: { type: String, required: false }, // Store securely in production
    ratings: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // From other table
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }], // From other table
    subscriptionStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
