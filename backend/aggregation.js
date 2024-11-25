const { MongoClient } = require("mongodb");
require("dotenv").config(); // Load environment variables from .env

const uri = process.env.MONGO_URI;

async function runAggregation() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("test"); // Replace 'test' with your database name
    const sales = db.collection("sales");

    const aggregationPipeline = [
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.productCategory", // Group by product category
          totalSales: { $sum: "$totalAmount" }, // Sum the sales amounts
          totalProducts: { $sum: "$quantity" }, // Sum the quantity of products sold
          productId: { $first: "$productDetails._id" }, // Capture the product's _id
        },
      },
      {
        $project: {
          category: "$_id", // Rename _id field to category
          totalSales: 1, // Include totalSales
          totalProducts: 1, // Include totalProducts
          _id: 0, // Exclude _id field
        },
      },
      {
        $merge: {
          into: "Summary", // Target collection
          whenMatched: "merge", // Merge with existing documents
          whenNotMatched: "insert", // Insert new documents
        },
      },
    ];

    await sales.aggregate(aggregationPipeline).toArray();
    console.log("Aggregation completed successfully!");
  } finally {
    await client.close();
  }
}

runAggregation().catch(console.error);
