import React, { useEffect, useState } from "react";
import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
  getAirQuality,
  createAirQuality,
  updateAirQuality,
  deleteAirQuality
} from "../api/api";

const DataTable = () => {
  const [stations, setStations] = useState([]);
  const [airData, setAirData] = useState([]);

  // Форма для нової станції + показників
  const [newStation, setNewStation] = useState({
    name: "",
    city: "",
    latitude: "",
    longitude: ""
  });
  const [newAir, setNewAir] = useState({
    pm25: "",
    pm10: "",
    no2: "",
    temperature: "",
    humidity: "",
    wind_speed: "",
    pressure: ""
  });

  // Додаткові стани для додавання показників до існуючої станції
  // mapping stationId -> inputs
  const [stationAirInputs, setStationAirInputs] = useState({});
  // який stationId зараз має відкриту форму додавання показників
  const [addingAirStationId, setAddingAirStationId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const stationsRes = await getStations();
      const airRes = await getAirQuality();
      setStations(Array.isArray(stationsRes) ? stationsRes : []);
      setAirData(Array.isArray(airRes) ? airRes : []);
    } catch (err) {
      console.error("fetchAll error:", err);
    }
  };

  const toNumberOrNull = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };

  const cleanObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const res = Array.isArray(obj) ? [] : {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (typeof v === "object") {
        const nested = cleanObject(v);
        if (Object.keys(nested).length > 0) res[k] = nested;
      } else {
        res[k] = v;
      }
    });
    return res;
  };

  // --- Додавання нової станції з показниками ---
  const handleAddStationWithAir = async () => {
    if (!newStation.name?.trim() || !newStation.city?.trim()) {
      alert("Вкажіть назву та місто станції.");
      return;
    }

    try {
      const stationPayload = {
        name: newStation.name.trim(),
        city: newStation.city.trim()
      };
      const lat = toNumberOrNull(newStation.latitude);
      const lon = toNumberOrNull(newStation.longitude);
      if (lat !== null) stationPayload.latitude = lat;
      if (lon !== null) stationPayload.longitude = lon;

      // Station model в бекенді вимагає latitude та longitude (required).
      if (stationPayload.latitude === undefined || stationPayload.longitude === undefined) {
        alert("Будь ласка, вкажіть координати (latitude та longitude) при створенні станції.");
        return;
      }

      const createdStation = await createStation(stationPayload);
      const stationId = createdStation?._id ?? createdStation?.id;

      const hasAnyAirValue = Object.values(newAir).some((v) => v !== "" && v !== null && v !== undefined);
      if (stationId && hasAnyAirValue) {
        const airPayload = {
          station_id: stationId,
          pm25: toNumberOrNull(newAir.pm25),
          pm10: toNumberOrNull(newAir.pm10),
          no2: toNumberOrNull(newAir.no2),
          temperature: toNumberOrNull(newAir.temperature),
          weather: {
            humidity: toNumberOrNull(newAir.humidity),
            wind_speed: toNumberOrNull(newAir.wind_speed),
            pressure: toNumberOrNull(newAir.pressure)
          }
        };
        await createAirQuality(cleanObject(airPayload));
      }

      setNewStation({ name: "", city: "", latitude: "", longitude: "" });
      setNewAir({ pm25: "", pm10: "", no2: "", temperature: "", humidity: "", wind_speed: "", pressure: "" });
      await fetchAll();
    } catch (err) {
      console.error("handleAddStationWithAir error:", err);
      alert("Помилка при додаванні станції або показників. Перевірте консоль.");
    }
  };

  // --- Додавання показників до існуючої станції ---
  const openAddAirForm = (stationId) => {
    setAddingAirStationId(stationId);
    setStationAirInputs((prev) => ({
      ...prev,
      [stationId]: { pm25: "", pm10: "", no2: "", temperature: "", humidity: "", wind_speed: "", pressure: "" }
    }));
  };

  const closeAddAirForm = (stationId) => {
    setAddingAirStationId((cur) => (cur === stationId ? null : cur));
    setStationAirInputs((prev) => {
      const copy = { ...prev };
      delete copy[stationId];
      return copy;
    });
  };

  const handleStationAirInputChange = (stationId, field, value) => {
    setStationAirInputs((prev) => ({
      ...prev,
      [stationId]: { ...(prev[stationId] || {}), [field]: value }
    }));
  };

  const submitAddAirToStation = async (stationId) => {
    try {
      const inputs = stationAirInputs[stationId] || {};
      const hasAny = Object.values(inputs).some((v) => v !== "" && v !== null && v !== undefined);
      if (!hasAny) {
        alert("Введіть хоча б одне значення показників.");
        return;
      }

      const payload = {
        station_id: stationId,
        pm25: toNumberOrNull(inputs.pm25),
        pm10: toNumberOrNull(inputs.pm10),
        no2: toNumberOrNull(inputs.no2),
        temperature: toNumberOrNull(inputs.temperature),
        weather: {
          humidity: toNumberOrNull(inputs.humidity),
          wind_speed: toNumberOrNull(inputs.wind_speed),
          pressure: toNumberOrNull(inputs.pressure)
        }
      };

      await createAirQuality(cleanObject(payload));
      closeAddAirForm(stationId);
      await fetchAll();
    } catch (err) {
      console.error("submitAddAirToStation error:", err);
      alert("Помилка при додаванні показників.");
    }
  };

  // --- Inline редагування станції ---
  const handleStationChange = (id, field, value) => {
    setStations((prev) =>
      prev.map((s) => (s._id === id || s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleStationSave = async (station) => {
    try {
      const payload = {
        name: station.name,
        city: station.city
      };
      const lat = toNumberOrNull(station.latitude);
      const lon = toNumberOrNull(station.longitude);
      if (lat !== null) payload.latitude = lat;
      if (lon !== null) payload.longitude = lon;

      const id = station._id ?? station.id;
      await updateStation(id, payload);
      await fetchAll();
    } catch (err) {
      console.error("handleStationSave error:", err);
      alert("Помилка при збереженні станції.");
    }
  };

  const handleDeleteStation = async (id) => {
    try {
      await deleteStation(id);
      await fetchAll();
    } catch (err) {
      console.error("handleDeleteStation error:", err);
      alert("Помилка при видаленні станції.");
    }
  };

  // --- Inline редагування показників ---
  const handleAirChange = (id, field, value) => {
    setAirData((prev) =>
      prev.map((a) => (a._id === id || a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleWeatherChange = (id, field, value) => {
    setAirData((prev) =>
      prev.map((a) =>
        a._id === id || a.id === id ? { ...a, weather: { ...(a.weather || {}), [field]: value } } : a
      )
    );
  };

  const handleAirSave = async (air) => {
    try {
      const payload = {
        pm25: toNumberOrNull(air.pm25),
        pm10: toNumberOrNull(air.pm10),
        no2: toNumberOrNull(air.no2),
        temperature: toNumberOrNull(air.temperature),
        weather: {
          humidity: toNumberOrNull(air.weather?.humidity),
          wind_speed: toNumberOrNull(air.weather?.wind_speed),
          pressure: toNumberOrNull(air.weather?.pressure)
        }
      };

      const id = air._id ?? air.id;
      await updateAirQuality(id, cleanObject(payload));
      await fetchAll();
    } catch (err) {
      console.error("handleAirSave error:", err);
      alert("Помилка при збереженні показників.");
    }
  };

  const handleDeleteAir = async (id) => {
    try {
      await deleteAirQuality(id);
      await fetchAll();
    } catch (err) {
      console.error("handleDeleteAir error:", err);
      alert("Помилка при видаленні показників.");
    }
  };

  // Кількість колонок у таблиці (для colspan при форму додавання)
  const TOTAL_COLUMNS = 12;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Станції моніторингу з показниками</h2>

      {/* === Форма для додавання нової станції + показників === */}
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Додати нову станцію з показниками</h3>
        <input placeholder="Назва" value={newStation.name} onChange={e => setNewStation({...newStation, name: e.target.value})} />
        <input placeholder="Місто" value={newStation.city} onChange={e => setNewStation({...newStation, city: e.target.value})} />
        <input type="number" placeholder="Latitude" value={newStation.latitude} onChange={e => setNewStation({...newStation, latitude: e.target.value})} />
        <input type="number" placeholder="Longitude" value={newStation.longitude} onChange={e => setNewStation({...newStation, longitude: e.target.value})} />

        <input type="number" placeholder="PM2.5" value={newAir.pm25} onChange={e => setNewAir({...newAir, pm25: e.target.value})} />
        <input type="number" placeholder="PM10" value={newAir.pm10} onChange={e => setNewAir({...newAir, pm10: e.target.value})} />
        <input type="number" placeholder="NO2" value={newAir.no2} onChange={e => setNewAir({...newAir, no2: e.target.value})} />
        <input type="number" placeholder="Temperature" value={newAir.temperature} onChange={e => setNewAir({...newAir, temperature: e.target.value})} />
        <input type="number" placeholder="Humidity" value={newAir.humidity} onChange={e => setNewAir({...newAir, humidity: e.target.value})} />
        <input type="number" placeholder="Wind Speed" value={newAir.wind_speed} onChange={e => setNewAir({...newAir, wind_speed: e.target.value})} />
        <input type="number" placeholder="Pressure" value={newAir.pressure} onChange={e => setNewAir({...newAir, pressure: e.target.value})} />

        <button onClick={handleAddStationWithAir}>Додати станцію з показниками</button>
      </div>

      {/* === Таблиця станцій і показників === */}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Місто</th>
            <th>Lat</th>
            <th>Lon</th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>NO2</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Wind Speed</th>
            <th>Pressure</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => {
            const stationId = s._id ?? s.id;
            const airs = airData.filter((a) => {
              const sid = a.station_id ?? a.stationId ?? a.station?._id ?? a.station?.id;
              return sid === stationId;
            });

            return (
              <React.Fragment key={stationId ?? Math.random()}>
                {airs.length > 0 ? (
                  // Рендеримо всі записи показників
                  airs.map((air, idx) => (
                    <tr key={air._id ?? air.id}>
                      {idx === 0 && (
                        <>
                          {/* Тепер rowSpan = airs.length (без додаткових +1), а форма додавання буде окремим повноширинним рядком */}
                          <td rowSpan={airs.length}>
                            <input value={s.name ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "name", e.target.value)} />
                          </td>
                          <td rowSpan={airs.length}>
                            <input value={s.city ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "city", e.target.value)} />
                          </td>
                          <td rowSpan={airs.length}>
                            <input type="number" value={s.latitude ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "latitude", e.target.value)} />
                          </td>
                          <td rowSpan={airs.length}>
                            <input type="number" value={s.longitude ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "longitude", e.target.value)} />
                          </td>
                        </>
                      )}

                      <td><input type="number" value={air.pm25 ?? ""} onChange={e => handleAirChange(air._id ?? air.id, "pm25", e.target.value)} /></td>
                      <td><input type="number" value={air.pm10 ?? ""} onChange={e => handleAirChange(air._id ?? air.id, "pm10", e.target.value)} /></td>
                      <td><input type="number" value={air.no2 ?? ""} onChange={e => handleAirChange(air._id ?? air.id, "no2", e.target.value)} /></td>
                      <td><input type="number" value={air.temperature ?? ""} onChange={e => handleAirChange(air._id ?? air.id, "temperature", e.target.value)} /></td>
                      <td><input type="number" value={air.weather?.humidity ?? ""} onChange={e => handleWeatherChange(air._id ?? air.id, "humidity", e.target.value)} /></td>
                      <td><input type="number" value={air.weather?.wind_speed ?? ""} onChange={e => handleWeatherChange(air._id ?? air.id, "wind_speed", e.target.value)} /></td>
                      <td><input type="number" value={air.weather?.pressure ?? ""} onChange={e => handleWeatherChange(air._id ?? air.id, "pressure", e.target.value)} /></td>

                      <td>
                        <button onClick={() => handleAirSave(air)}>Зберегти</button>
                        <button onClick={() => handleDeleteAir(air._id ?? air.id)}>Видалити показники</button>
                        {idx === 0 && <button onClick={() => handleStationSave(s)}>Зберегти станцію</button>}
                      </td>
                    </tr>
                  ))
                ) : (
                  // Якщо станція ще без показників — показуємо одну рядок з полями для станції
                  <tr key={`noair-${stationId}`}>
                    <td>
                      <input value={s.name ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "name", e.target.value)} />
                    </td>
                    <td>
                      <input value={s.city ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "city", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" value={s.latitude ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "latitude", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" value={s.longitude ?? ""} onChange={e => handleStationChange(s._id ?? s.id, "longitude", e.target.value)} />
                    </td>
                    <td colSpan="7">
                      <i>Показники відсутні</i>
                    </td>
                    <td>
                      <button onClick={() => openAddAirForm(stationId)}>Додати показники</button>
                      <button onClick={() => handleDeleteStation(s._id ?? s.id)}>Видалити станцію</button>
                      <button onClick={() => handleStationSave(s)}>Зберегти станцію</button>
                    </td>
                  </tr>
                )}

                {/* Якщо для цієї станції відкрита форма додавання показників — рендеримо ОКРЕМИЙ повноширинний рядок (colspan = TOTAL_COLUMNS) */}
                {addingAirStationId === stationId && (
                  <tr key={`addair-form-${stationId}`}>
                    <td colSpan={TOTAL_COLUMNS} style={{ padding: "8px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>PM2.5</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.pm25 ?? ""} onChange={e => handleStationAirInputChange(stationId, "pm25", e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>PM10</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.pm10 ?? ""} onChange={e => handleStationAirInputChange(stationId, "pm10", e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>NO2</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.no2 ?? ""} onChange={e => handleStationAirInputChange(stationId, "no2", e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>Temp</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.temperature ?? ""} onChange={e => handleStationAirInputChange(stationId, "temperature", e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>Humidity</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.humidity ?? ""} onChange={e => handleStationAirInputChange(stationId, "humidity", e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>Wind</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.wind_speed ?? ""} onChange={e => handleStationAirInputChange(stationId, "wind_speed", e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <label style={{ fontSize: 12 }}>Pressure</label>
                          <input style={{ width: 80 }} type="number" value={stationAirInputs[stationId]?.pressure ?? ""} onChange={e => handleStationAirInputChange(stationId, "pressure", e.target.value)} />
                        </div>

                        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                          <button onClick={() => submitAddAirToStation(stationId)}>Додати</button>
                          <button onClick={() => closeAddAirForm(stationId)}>Скасувати</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Для станцій, які мають записи, додаємо кнопку "Додати показники" після записів (як окремий рядок з action) */}
                {airs.length > 0 && addingAirStationId !== stationId && (
                  <tr key={`action-row-${stationId}`}>
                    <td colSpan={11} style={{ textAlign: "right", paddingRight: "10px" }}>
                      <button onClick={() => openAddAirForm(stationId)}>Додати ще показників для цієї станції</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteStation(s._id ?? s.id)}>Видалити станцію</button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;