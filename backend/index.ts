import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import salesRoute from "./routes/salesRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;
const uri = process.env.MONGO_URI as string; // Type assertion to ensure it's a string

// MongoDB Connection
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Middleware
app.use(express.json()); // Use express's built-in JSON parser

// Test Route to verify server is working
app.get("/", (req: Request, res: Response): void => {
  res.send("Server is running!");
});

// Authentication Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/api/sales", salesRoute);
app.use("/analytics", dashboardRoutes);

// Global Error Handling Middleware (optional)
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
