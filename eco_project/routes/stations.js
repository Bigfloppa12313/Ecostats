import express from "express";
import {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation
} from "../controllers/stationsController.js";

const router = express.Router();

router.get("/", getStations);
router.get("/:id", getStationById);
router.post("/", createStation);
router.put("/:id", updateStation);
router.delete("/:id", deleteStation);

export default router;
