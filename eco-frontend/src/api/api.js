import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Станції ---
export const getStations = async () => {
  try {
    const response = await api.get("/stations");
    return response.data?.data ?? [];
  } catch (err) {
    console.error("getStations error:", err);
    throw err;
  }
};

export const createStation = async (station) => {
  try {
    const response = await api.post("/stations", station);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error("createStation error:", err);
    throw err;
  }
};

export const updateStation = async (id, station) => {
  try {
    const response = await api.put(`/stations/${id}`, station);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error("updateStation error:", err);
    throw err;
  }
};

export const deleteStation = async (id) => {
  try {
    await api.delete(`/stations/${id}`);
    return true;
  } catch (err) {
    console.error("deleteStation error:", err);
    throw err;
  }
};

// --- Показники AirQuality ---
export const getAirQuality = async () => {
  try {
    const response = await api.get("/airquality");
    return response.data?.data ?? [];
  } catch (err) {
    console.error("getAirQuality error:", err);
    throw err;
  }
};

export const createAirQuality = async (data) => {
  try {
    const response = await api.post("/airquality", data);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error("createAirQuality error:", err);
    throw err;
  }
};

export const updateAirQuality = async (id, data) => {
  try {
    const response = await api.put(`/airquality/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (err) {
    console.error("updateAirQuality error:", err);
    throw err;
  }
};

export const deleteAirQuality = async (id) => {
  try {
    await api.delete(`/airquality/${id}`);
    return true;
  } catch (err) {
    console.error("deleteAirQuality error:", err);
    throw err;
  }
};