import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Define a custom request interface
interface AuthenticatedRequest extends Request {
  user: IUser; // Note: not optional here
}

export const authorizeRole = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(403).json({ message: "No token provided" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as IUser;

      // Type assertion here
      (req as AuthenticatedRequest).user = decoded;

      if (!roles.includes((req as AuthenticatedRequest).user.role)) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
