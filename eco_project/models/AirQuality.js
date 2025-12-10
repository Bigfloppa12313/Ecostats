import mongoose from "mongoose";

const AirQualitySchema = new mongoose.Schema({
  station_id: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  pm25: Number,
  pm10: Number,
  no2: Number,
  temperature: Number,

  weather: {
    humidity: Number,
    wind_speed: Number,
    pressure: Number
  }
});

export default mongoose.model("AirQuality", AirQualitySchema);
