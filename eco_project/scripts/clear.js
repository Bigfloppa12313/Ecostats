import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Station from "../models/Station.js";
import AirQuality from "../models/AirQuality.js";

const run = async () => {
  try {
    await connectDB();
    console.log("Очищую Station і AirQuality...");
    const s = await Station.deleteMany({});
    const a = await AirQuality.deleteMany({});
    console.log(`Station видалено: ${s.deletedCount}, AirQuality видалено: ${a.deletedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Помилка під час очищення:", err);
    process.exit(1);
  }
};

run();