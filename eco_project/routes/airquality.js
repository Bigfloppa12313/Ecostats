import express from "express";
import {
  getAirQuality,
  getAirQualityById,
  createAirQuality,
  updateAirQuality,
  deleteAirQuality
} from "../controllers/airqualityController.js";

const router = express.Router();

router.get("/", getAirQuality);
router.get("/:id", getAirQualityById);
router.post("/", createAirQuality);
router.put("/:id", updateAirQuality);
router.delete("/:id", deleteAirQuality);

export default router;
