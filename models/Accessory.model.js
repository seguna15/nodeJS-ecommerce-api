//Accessory schema

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AccessorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "https://picsum.photos/200/300",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Accessory = mongoose.model("Accessory", AccessorySchema);
export default Accessory;