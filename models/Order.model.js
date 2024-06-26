import mongoose from "mongoose";
import genRandomNumber from "../utils/genRandomNumber.util.js";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      type: Object,
      required: true,
    },
  ],
  shippingAddress: {
    type: Object,
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    default: await genRandomNumber(),
  },
  // For stripe or paypal
  paymentStatus: {
    type: String,
    default: "Not paid",
  },
  paymentMethod: {
    type: String,
    default: "Not specified",
  },
  totalPrice: {
    type: Number,
    default: 0.0,
  },
  currency: {
    type: String,
    default: "Not specified",
  },
  //For Admin
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered"]
  },
  deliveredAt: {
    type: Date
  }
},{
    timestamps: true,
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;