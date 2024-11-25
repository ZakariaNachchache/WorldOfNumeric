// Define the Sale model and interface for the MongoDB database.

import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./Product"; // Import the Product interface

// Define the interface for the Sale document
export interface ISale extends Document {
  saleId: number;
  productId: IProduct["_id"]; // Reference to the Product model
  quantity: number;
  date: Date;
  totalAmount: number;
}

// Define the sale schema
const saleSchema: Schema<ISale> = new mongoose.Schema(
  {
    saleId: {
      type: Number,
      required: true,
      unique: true, // Ensure SaleID is unique
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
      ref: "Product", // Use the name of the Product model for reference
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Sale model based on the schema
export const Sale = mongoose.model<ISale>("Sale", saleSchema); // Export Sale as a named export

export default Sale;
