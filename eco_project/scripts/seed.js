import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Station from "../models/Station.js";
import AirQuality from "../models/AirQuality.js";

const rand = (min, max, precision = 1) =>
  Math.round((Math.random() * (max - min) + min) * 10 ** precision) /
  10 ** precision;

const sampleStations = [
  {
    name: "Central Park Station",
    city: "Kyiv",
    latitude: 50.4501,
    longitude: 30.5234,
    active: true,
    contact: { email: "central@aq.example", phone: "+380441112233" },
    measurement_types: ["PM2.5", "PM10", "NO2", "Temperature", "Humidity"]
  },
  {
    name: "Industrial Zone Station",
    city: "Dnipro",
    latitude: 48.4647,
    longitude: 35.0462,
    active: true,
    contact: { email: "industrial@aq.example", phone: "+380562223344" },
    measurement_types: ["PM2.5", "PM10", "NO2", "Temperature"]
  },
  {
    name: "Seaside Station",
    city: "Odesa",
    latitude: 46.4825,
    longitude: 30.7233,
    active: true,
    contact: { email: "seaside@aq.example", phone: "+380482334455" },
    measurement_types: ["PM2.5", "PM10", "Humidity", "Temperature"]
  }
];

const generateMeasurementsForStation = (stationId, hours = 24) => {
  const measurements = [];
  const now = Date.now();

  for (let h = 0; h < hours; h++) {
    const timestamp = new Date(now - h * 60 * 60 * 1000);
    // realistic but random ranges
    const pm25 = rand(3, 80, 1);
    const pm10 = rand(8, 140, 1);
    const no2 = rand(2, 90, 1);
    const temperature = rand(-5, 35, 1);
    const humidity = rand(25, 95, 0);
    const wind_speed = rand(0, 12, 1);
    const pressure = rand(980, 1035, 0);

    measurements.push({
      station_id: stationId.toString(),
      timestamp,
      pm25,
      pm10,
      no2,
      temperature,
      weather: {
        humidity,
        wind_speed,
        pressure
      }
    });
  }

  return measurements;
};

const run = async () => {
  try {
    await connectDB();

    console.log("Очищую колекції Station і AirQuality...");
    await Station.deleteMany({});
    await AirQuality.deleteMany({});

    console.log("Інсерчу прикладні станції...");
    const insertedStations = await Station.insertMany(sampleStations);
    console.log(`Додано станцій: ${insertedStations.length}`);

    console.log("Генерую і інсерчу вимірювання для кожної станції (24 записи/станція)...");
    const allMeasurements = [];
    insertedStations.forEach((st) => {
      const m = generateMeasurementsForStation(st._id, 24);
      allMeasurements.push(...m);
    });

    const insertedMeasures = await AirQuality.insertMany(allMeasurements);
    console.log(`Додано вимірювань: ${insertedMeasures.length}`);

    console.log("Seed завершений успішно.");
    process.exit(0);
  } catch (err) {
    console.error("Під час seed сталася помилка:", err);
    process.exit(1);
  }
};

run();