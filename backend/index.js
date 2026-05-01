import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(bodyParser.json());

const connectionString = process.env.MONGODB_URI;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
