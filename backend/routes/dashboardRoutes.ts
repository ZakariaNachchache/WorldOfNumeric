import express, { Request, Response } from "express";
import Sale from "../models/Sale";
import Summary from "../models/SalesSummary";
import { authorizeRole } from "../middleware/authMiddleware";

const router = express.Router();

// Interface for query parameters
interface SalesQuery {
  startDate?: string; // Make these optional to match Express's typing
  endDate?: string;
}

// Test Route
router.get(
  "/",
  authorizeRole(["admin"]),
  async (req: Request, res: Response) => {
    res.send("Hello World");
  }
);

// Total Sales Route Handler
const getTotalSales = async (
  req: Request<{}, {}, {}, SalesQuery>,
  res: Response
) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ error: "startDate and endDate are required" });
    return;
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    end.setHours(23, 59, 59, 999);

    const totalSales = await Sale.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const total = totalSales[0]?.totalAmount || 0;
    res.status(200).json({ totalSales: total });
  } catch (error) {
    console.error("Error calculating total sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Trending Products Handler
const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const trendingProducts = await Sale.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$productId",
          productName: { $first: "$productDetails.productName" },
          totalQuantity: { $sum: "$quantity" },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json(trendingProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Category Sales Handler
const getCategorySales = async (req: Request, res: Response) => {
  try {
    const salesSummaries = await Summary.find({});

    if (!salesSummaries || salesSummaries.length === 0) {
      res.status(404).json({ error: "No sales data found" });
      return;
    }

    const totalSales = salesSummaries.reduce(
      (acc, summary) => acc + summary.totalSales,
      0
    );

    const categorySales = salesSummaries.map((summary) => {
      const percentage = ((summary.totalSales / totalSales) * 100).toFixed(2);
      return {
        category: summary.category,
        totalSales: summary.totalSales,
        salesPercentage: percentage,
      };
    });

    res.status(200).json({
      totalSales,
      categorySales,
    });
  } catch (error) {
    console.error("Error fetching category sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route registration with type assertions
router.get(
  "/total_sales",
  authorizeRole(["admin"]),
  getTotalSales as express.RequestHandler
);

router.get(
  "/trending_products",
  authorizeRole(["admin"]),
  getTrendingProducts as express.RequestHandler
);

router.get(
  "/category_sales",
  authorizeRole(["admin"]),
  getCategorySales as express.RequestHandler
);

export default router;
