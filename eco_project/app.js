import express from "express";
import cors from "cors";
import stationsRoutes from "./routes/stations.js";
import airQualityRoutes from "./routes/airquality.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/stations", stationsRoutes);
app.use("/api/airquality", airQualityRoutes);

export default app;
