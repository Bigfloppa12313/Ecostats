import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB, clearDB } from "./setup.js";
import Station from "../models/Station.js";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Stations API", () => {

  test("має створити нову станцію", async () => {
    const response = await request(app)
      .post("/api/stations")
      .send({
        name: "Тестова станція",
        city: "Київ",
        latitude: 50.4501,
        longitude: 30.5234
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Тестова станція");
  });

  test("має отримати всі станції", async () => {
    await Station.create({
      name: "Станція 1",
      city: "Львів",
      latitude: 49.84,
      longitude: 24.03
    });

    const response = await request(app)
      .get("/api/stations")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test("має оновити станцію", async () => {
    const station = await Station.create({
      name: "Old name",
      city: "Полтава",
      latitude: 49.588,
      longitude: 34.551
    });

    const response = await request(app)
      .put(`/api/stations/${station._id}`)
      .send({ name: "New Updated Name" })
      .expect(200);

    expect(response.body.data.name).toBe("New Updated Name");
  });

  test("має видалити станцію", async () => {
    const station = await Station.create({
      name: "Delete me",
      city: "Одеса",
      latitude: 46.4825,
      longitude: 30.7233
    });

    await request(app)
      .delete(`/api/stations/${station._id}`)
      .expect(200);

    const exists = await Station.findById(station._id);
    expect(exists).toBeNull();
  });

});
