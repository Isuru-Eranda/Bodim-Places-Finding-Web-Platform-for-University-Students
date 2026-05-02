import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";

await connectDB();

const email = "admin@example.com";
const existing = await User.findOne({ email });

if (existing) {
  console.log("Admin user already exists:", email);
  process.exit(0);
}

const hashed = await bcrypt.hash("Password", 10);
await User.create({ name: "Admin", email, password: hashed, role: "admin" });

console.log("Admin user created successfully:");
console.log("  Email:   ", email);
console.log("  Password: Password");
process.exit(0);
