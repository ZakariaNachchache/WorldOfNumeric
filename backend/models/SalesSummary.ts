import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Summary document
interface ISummary extends Document {
  category: string; // The category of products (e.g., "Sports & Outdoors")
  totalProducts: number; // The total number of products in the category
  totalSales: number; // The total sales amount for the category
}

// Define the Summary schema
const SummarySchema: Schema<ISummary> = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true, // The category of products
    },
    totalProducts: {
      type: Number,
      required: true, // The total number of products
    },
    totalSales: {
      type: Number,
      required: true, // The total sales amount
    },
  },
  {
    collection: "Summary", // Specify the collection name
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Summary model based on the schema
const Summary = mongoose.model<ISummary>("Summary", SummarySchema);

export default Summary;
