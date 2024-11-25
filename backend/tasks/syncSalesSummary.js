// aggregation.js - Change Stream script
const { MongoClient } = require("mongodb");
require("dotenv").config(); // Load environment variables from .env

const uri = process.env.MONGO_URI; // Your MongoDB URI

async function runAggregationOnSale() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("test"); // Replace with your database name
    const sales = db.collection("sales");
    const salesSummary = db.collection("salesSummary");

    // Set up a change stream on the 'sales' collection
    const changeStream = sales.watch();
    console.log("Watrching for changes in the 'sales' collection...");
    changeStream.on("change", async (change) => {
      // When a new sale is inserted, update the salesSummary collection
      if (change.operationType === "insert") {
        const newSale = change.fullDocument;

        // Find the corresponding product details
        const product = await db
          .collection("products")
          .findOne({ _id: newSale.productId });

        // Aggregate the new sale into the summary by category
        await salesSummary.updateOne(
          { _id: product.productCategory },
          {
            $inc: { totalSales: newSale.totalAmount }, // Increment the total sales
          },
          { upsert: true } // If no category exists, insert a new document
        );

        console.log(
          `SalesSummary updated for category: ${product.productCategory}`
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
}

runAggregationOnSale().catch(console.error);
