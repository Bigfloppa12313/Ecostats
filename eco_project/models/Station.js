import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, maxlength: 50 },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },

  contact: {
    email: String,
    phone: String
  },

  measurement_types: [{
    type: String,
    enum: ["PM2.5", "PM10", "Temperature", "Humidity", "NO2"]
  }]
});

export default mongoose.model("Station", StationSchema);
