// Product model

import mongoose, { Document } from "mongoose";

// Define the interface for the Product document
export interface IProduct extends Document {
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
}

// Define the product schema
const productSchema = new mongoose.Schema<IProduct>(
  {
    productId: {
      type: String,
      required: true,
      unique: true, // Make sure productId is unique
    },
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Product model based on the schema
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
