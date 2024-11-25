// import mongoose, { Document, Schema } from "mongoose";
// import { IProduct } from "./Product"; // Import the IProduct interface for type reference

// // Define the interface for the Sale document
// interface ISale extends Document {
//   saleId: number;
//   productId: IProduct["_id"]; // Reference to the Product model (Product's ObjectId)
//   quantity: number;
//   date: Date;
//   totalAmount: number;
// }

// // Define the sale schema
// const salesSchema: Schema<ISale> = new mongoose.Schema(
//   {
//     saleId: {
//       type: Number,
//       required: true,
//       unique: true, // Ensure SaleID is unique
//     },
//     productId: {
//       type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
//       ref: "Product", // Use the name of the Product model for reference
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true, // Automatically add createdAt and updatedAt fields
//   }
// );

// // Create the Sale model based on the schema
// const Sale = mongoose.model < ISale > ("Sale", salesSchema);

// export default Sale;
