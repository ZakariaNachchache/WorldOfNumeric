//this script is used to import products from a CSV file into a MongoDB database.

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Product, { IProduct } from "../models/Product";

import dotenv from "dotenv";

dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGO_URI!;
const csvFilePath = path.join(__dirname, "files", "products.csv");

// Function to connect to MongoDB
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if connection fails
  }
};

// Function to read CSV and parse products
const parseCsv = (filePath: string): Promise<Partial<IProduct>[]> => {
  return new Promise((resolve, reject) => {
    const products: Partial<IProduct>[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Map CSV columns to the MongoDB model (using Partial<IProduct>)
        const product: Partial<IProduct> = {
          productId: row.ProductID, //  productId
          productName: row.ProductName, // productName
          productCategory: row.Category, //  productCategory
          productPrice: parseFloat(row.Price), //productPrice
        };
        products.push(product);
      })
      .on("end", () => resolve(products))
      .on("error", (error) => reject(error));
  });
};

const importProducts = async (products: Partial<IProduct>[]): Promise<void> => {
  try {
    await Product.insertMany(products); // Insert all products to DB
    console.log(`${products.length} products imported successfully.`);
  } catch (error) {
    console.error("Error inserting products:", error);
  }
};

// function to handle the complete process
const main = async (): Promise<void> => {
  await connectToDatabase();

  try {
    const products = await parseCsv(csvFilePath);
    await importProducts(products);
  } catch (error) {
    console.error("Error processing the CSV file:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

main();
