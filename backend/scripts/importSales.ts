//this script is used to import sales from a CSV file into a MongoDB database while insuring the data is correctly formatted and a relation between sales and products is maintained.
//insertion works in batchs to insure that the data is inserted in a timely manner and not interupted by Mongodb service.

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Sale from "../models/Sale";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// MongoDB connection URI and CSV file path
const uri = process.env.MONGO_URI!;
const csvFilePath = path.join(__dirname, "files", "sales.csv"); // Path to your sales CSV file

// Defining the SaleData type for the rows in the CSV
interface SaleData {
  SaleID: string;
  ProductID: string;
  Quantity: string;
  Date: string;
  TotalAmount: string;
}

// Function to connect to the MongoDB database
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if connection fails
  }
};

// Function to importing sales data from CSV into MongoDB
const importSales = async (): Promise<void> => {
  const sales: Array<{
    saleId: number;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    date: Date;
    totalAmount: number;
  }> = []; // Type the sales array
  let rowCount = 0; // To keep track of the row number

  // Create a readable stream to read the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row: SaleData) => {
      try {
        rowCount++; // Increment the row count for each row read
        console.log(`Processing row ${rowCount}:`, row); // Logging the row being processed

        // Preparing the sale object
        const sale = {
          saleId: parseInt(row.SaleID), //SaleID
          productId: new mongoose.Types.ObjectId(row.ProductID), // Convertnig ProductID to ObjectId
          quantity: parseInt(row.Quantity), //  Quantity
          date: new Date(row.Date), // Converting Date string to Date object
          totalAmount: parseFloat(row.TotalAmount), // Ensuring TotalAmount is a float
        };

        sales.push(sale); // Adding sale to sales array
      } catch (error) {
        console.error("Error processing row:", row, error);
      }
    })
    .on("end", async () => {
      try {
        console.log(
          `Finished reading the CSV file. Preparing to insert ${sales.length} sales.`
        );

        if (sales.length > 0) {
          // Insert sales into the database
          await Sale.insertMany(sales);
          console.log(`${sales.length} sales records imported successfully.`);
        } else {
          console.log("No valid sales data to insert.");
        }
      } catch (error) {
        console.error("Error inserting sales into the database:", error);
      } finally {
        mongoose.disconnect(); // Disconnect from the database when finished
      }
    });
};

// Main function to handle the complete process
const main = async (): Promise<void> => {
  await connectToDatabase();
  await importSales();
};
//execution
main();
