import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import stationsRoutes from "./routes/stations.js";
import airQualityRoutes from "./routes/airquality.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.use("/api/stations", stationsRoutes);
app.use("/api/airquality", airQualityRoutes);

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
