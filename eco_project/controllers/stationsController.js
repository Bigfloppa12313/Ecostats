import Station from "../models/Station.js";

export const getStations = async (req, res) => {
  const stations = await Station.find();
  res.json({ success: true, data: stations });
};

export const getStationById = async (req, res) => {
  const station = await Station.findById(req.params.id);
  if (!station)
    return res.status(404).json({ success: false, error: "Station not found" });

  res.json({ success: true, data: station });
};

export const createStation = async (req, res) => {
  try {
    const newStation = new Station(req.body);
    await newStation.save();
    res.status(201).json({ success: true, data: newStation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateStation = async (req, res) => {
  const station = await Station.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!station)
    return res.status(404).json({ success: false, error: "Station not found" });

  res.json({ success: true, data: station });
};

export const deleteStation = async (req, res) => {
  const station = await Station.findByIdAndDelete(req.params.id);

  if (!station)
    return res.status(404).json({ success: false, error: "Station not found" });

  res.json({ success: true, message: "Station deleted" });
};
