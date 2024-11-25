import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User"; // Import User model and IUser interface

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Signup Route
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    email,
    password,
    role,
  }: { username: string; email: string; password: string; role?: string } =
    req.body;
  try {
    // Check if the user already exists
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return; // Simply return after sending the response
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create a new user with the role
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await user.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Login Route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return; // Return after sending the response
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return; // Return after sending the response
    }

    // Create a JWT token including the user's id and role
    const token: string = jwt.sign(
      { id: user._id, role: user.role }, // Include the role in the payload
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
