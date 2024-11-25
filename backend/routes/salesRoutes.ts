import express, { Request, Response, RequestHandler } from "express";
import Sale from "../models/Sale";
import { authorizeRole } from "../middleware/authMiddleware";

// Interfaces remain the same
interface SalesQuery {
  startDate?: string;
  endDate?: string;
}

interface ProductParams {
  productId: string;
}

interface DateParams {
  date: string;
}

interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

const router = express.Router();

// getAllSales remains the same
const getAllSales: RequestHandler<{}, {}, {}, SalesQuery> = async (
  req,
  res
) => {
  try {
    const { startDate, endDate } = req.query;
    let query: Record<string, any> = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query);
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// Fixed getSalesForProduct with type coercion
const getSalesForProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  try {
    const sales = await Sale.find({ productId });

    if (sales.length === 0) {
      res.status(404).json({ message: "No sales found for this product" });
      return;
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// Fixed getSalesByDate with type coercion
const getSalesByDate: RequestHandler = async (req, res) => {
  const { date } = req.params;
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    res.status(400).json({ message: "Invalid date format" });
    return;
  }

  try {
    const sales = await Sale.find({ date: parsedDate });

    if (sales.length === 0) {
      res.status(404).json({ message: "No sales found for this date" });
      return;
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// getSalesInDateRange remains the same
const getSalesInDateRange: RequestHandler<{}, {}, {}, DateRangeQuery> = async (
  req,
  res
) => {
  const { startDate, endDate } = req.query;
  const start = new Date(startDate || "");
  const end = new Date(endDate || "");

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400).json({ message: "Invalid date range format" });
    return;
  }

  try {
    const sales = await Sale.find({
      date: { $gte: start, $lte: end },
    });

    if (sales.length === 0) {
      res.status(404).json({ message: "No sales found in this date range" });
      return;
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// Fixed route registration with type assertions
router.get("/", authorizeRole(["admin"]), getAllSales);
router.get(
  "/product/:productId",
  authorizeRole(["admin"]),
  getSalesForProduct as RequestHandler
);
router.get(
  "/date/:date",
  authorizeRole(["admin"]),
  getSalesByDate as RequestHandler
);
router.get("/date-range", authorizeRole(["admin"]), getSalesInDateRange);

export default router;
