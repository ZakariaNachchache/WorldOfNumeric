import express, { Request, Response, RequestHandler } from "express";
import Product from "../models/Product";
import Sale from "../models/Sale";
import { authorizeRole } from "../middleware/authMiddleware"; // Import authorization middleware

const router = express.Router();

// Define types for the request body
interface ProductRequestBody {
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
}

// Define types for the request params (for `PUT` and `DELETE` routes)
interface ProductRequestParams {
  productId: string;
}

// Corrected route handler (no need to explicitly return the Response)
const getProductsWithSales: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productsWithSales = await Sale.aggregate([
      {
        $group: {
          _id: "$productId",
          totalSalesCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 1,
          productName: "$productDetails.productName",
          productCategory: "$productDetails.productCategory",
          productPrice: "$productDetails.productPrice",
          totalSalesCount: 1,
        },
      },
    ]);
    res.status(200).json(productsWithSales);
  } catch (error) {
    console.error("Error fetching products with sales:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addNewProduct: RequestHandler<{}, {}, ProductRequestBody> = async (
  req: Request<{}, {}, ProductRequestBody>,
  res: Response
) => {
  const { productId, productName, productCategory, productPrice } = req.body;

  try {
    const newProduct = new Product({
      productId,
      productName,
      productCategory,
      productPrice,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Routes
router.get("/", authorizeRole(["admin"]), getProductsWithSales);
router.post("/", authorizeRole(["admin"]), addNewProduct);

export default router;
