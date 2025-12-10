import AirQuality from "../models/AirQuality.js";

export const getAirQuality = async (req, res) => {
  const list = await AirQuality.find();
  res.json({ success: true, data: list });
};

export const getAirQualityById = async (req, res) => {
  const item = await AirQuality.findById(req.params.id);

  if (!item)
    return res.status(404).json({ success: false, error: "Not found" });

  res.json({ success: true, data: item });
};

export const createAirQuality = async (req, res) => {
  try {
    const item = new AirQuality(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateAirQuality = async (req, res) => {
  const item = await AirQuality.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!item)
    return res.status(404).json({ success: false, error: "Not found" });

  res.json({ success: true, data: item });
};

export const deleteAirQuality = async (req, res) => {
  const item = await AirQuality.findByIdAndDelete(req.params.id);

  if (!item)
    return res.status(404).json({ success: false, error: "Not found" });

  res.json({ success: true, message: "Deleted" });
};
