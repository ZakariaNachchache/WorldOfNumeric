const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product"); // Your Product model
const Sale = require("../models/Sale"); // Your Sale model
import dotenv from "dotenv";

dotenv.config();
const csvFilePath = path.join(__dirname, "files", "sales.csv"); // Path to your sales CSV file
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 60000,
    family: 4,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

async function importSalesData() {
  const salesData = [];
  let totalRecords = 0;
  let processedRecords = 0;
  const batchSize = 1000; // Size of each batch for inserting records

  // Read CSV file and count the total number of rows for progress tracking
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      salesData.push(row);
      totalRecords++;
    })
    .on("end", async () => {
      console.log(`Total records in CSV: ${totalRecords}`);

      // Create an array of sales to be inserted
      const salesToInsert = [];

      // Now process each sale record
      for (const row of salesData) {
        const saleId = parseInt(row.SaleID, 10);
        const productId = row.ProductID;
        const quantity = parseInt(row.Quantity, 10);
        const saleDate = new Date(row.Date);
        const totalAmount = parseFloat(row.TotalAmount);

        if (!productId || isNaN(saleDate.getTime())) {
          console.log(
            `Skipping SaleID ${saleId} because of invalid productId or date`
          );
          continue;
        }

        const product = await Product.findOne({ productId: productId });

        if (product) {
          const sale = {
            saleId: saleId,
            productId: product._id,
            quantity: quantity,
            date: saleDate,
            totalAmount: totalAmount,
          };
          salesToInsert.push(sale);

          processedRecords++;

          if (
            processedRecords % batchSize === 0 ||
            processedRecords === totalRecords
          ) {
            console.log(`Inserting batch of ${batchSize} records...`);
            try {
              await Sale.insertMany(salesToInsert);
              console.log(`Batch inserted: ${salesToInsert.length} records.`);
              salesToInsert.length = 0; // Clear the array for the next batch
            } catch (err) {
              console.error("Error inserting batch:", err);
            }
          }
        } else {
          console.log(
            `Product with ID ${productId} not found for SaleID ${saleId}.`
          );
        }
      }

      // Insert any remaining records
      if (salesToInsert.length > 0) {
        try {
          await Sale.insertMany(salesToInsert);
          console.log(`Remaining records inserted: ${salesToInsert.length}`);
        } catch (err) {
          console.error("Error inserting remaining records:", err);
        }
      }

      console.log("CSV file successfully processed");
      mongoose.disconnect();
    });
}

importSalesData();
