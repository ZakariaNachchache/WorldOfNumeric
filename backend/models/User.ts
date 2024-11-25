import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define the interface for the User document
export interface IUser extends Document {
  // Use export keyword
  username: string;
  email: string;
  password: string;
  role: "user" | "admin"; // Restrict role to 'user' or 'admin'
}

// Define the user schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // You can add more roles if needed
      default: "user", // Default role is "user"
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create the User model based on the schema
const User = mongoose.model<IUser>("User", userSchema);

export default User;
