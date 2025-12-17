import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { generateItems } from '../utils/synthGenerator';
import EcoTaxResult from './EcoTaxResult';

export default function EcoTaxForm() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [period, setPeriod] = useState('');
  const [objectType, setObjectType] = useState('');
  const [items, setItems] = useState([]);

  const [savedObjects, setSavedObjects] = useState([]);
  const [selectedSaved, setSelectedSaved] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /* =========================
     LOAD OBJECTS FROM DB
     ========================= */
  useEffect(() => {
    axios
      .get(`${API_URL}/ecotax/objects`)
      .then(res => {
        if (res.data?.success) {
          setSavedObjects(res.data.data);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  /* =========================
     FORM HELPERS
     ========================= */
  function addEmptyItem() {
    setItems([
      ...items,
      {
        pollutant: '',
        amount: 0.1,
        amountUnit: 't',
        rate: 10,
        kTime: 1,
        kRegion: 1,
        kBenefit: 1
      }
    ]);
  }

  function removeItem(idx) {
    const copy = [...items];
    copy.splice(idx, 1);
    setItems(copy);
  }

  function updateItem(idx, key, value) {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [key]: value };
    setItems(copy);
  }

  function generate(scenario = 'basic') {
    setItems(generateItems(3, scenario));
    setSelectedSaved('');
  }

  /* =========================
     LOAD ITEMS FROM DB
     ========================= */
  async function loadFromDb(value) {
    if (!value) return;

    const [p, o] = value.split('|');
    setPeriod(p);
    setObjectType(o);

    try {
      const { data } = await axios.get(`${API_URL}/ecotax/items`, {
        params: { period: p, objectType: o }
      });

      if (data.success) {
        // subtotal не потрібен у формі
        const clean = data.data.map(({ subtotal, __v, _id, createdAt, updatedAt, ...rest }) => rest);
        setItems(clean);
      }
    } catch (err) {
      setError('Не вдалося завантажити дані з БД');
    }
  }

  /* =========================
     SUBMIT
     ========================= */
  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        period: period || new Date().toISOString().slice(0, 7),
        objectType,
        items
      };

      const { data } = await axios.post(`${API_URL}/ecotax/calc`, payload);

      if (!data.success) {
        throw new Error(data.error || 'Server error');
      }

      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div>
      <h3>Розрахунок екологічного податку</h3>

      <form onSubmit={submit}>
        {/* ========================= */}
        {/* LOAD FROM DB */}
        {/* ========================= */}
        <div>
          <label>Готові обʼєкти з БД</label>
          <select
            value={selectedSaved}
            onChange={e => {
              setSelectedSaved(e.target.value);
              loadFromDb(e.target.value);
            }}
          >
            <option value="">— не обрано —</option>
            {savedObjects.map((o, i) => (
              <option key={i} value={`${o.period}|${o.objectType}`}>
                {o.objectType} ({o.period})
              </option>
            ))}
          </select>
        </div>

        {/* ========================= */}
        {/* BASIC INFO */}
        {/* ========================= */}
        <div>
          <label>Період (YYYY-MM)</label>
          <input
            value={period}
            onChange={e => setPeriod(e.target.value)}
            placeholder="2025-01"
          />
        </div>

        <div>
          <label>Обʼєкт</label>
          <input
            value={objectType}
            onChange={e => setObjectType(e.target.value)}
            placeholder="Factory A"
          />
        </div>

        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}
        <div style={{ margin: '10px 0' }}>
          <button type="button" onClick={() => generate('basic')}>
            Згенерувати базовий
          </button>
          <button type="button" onClick={() => generate('city')}>
            Згенерувати міський
          </button>
          <button type="button" onClick={() => generate('benefit')}>
            Згенерувати пільга
          </button>
          <button type="button" onClick={addEmptyItem}>
            Додати речовину
          </button>
        </div>

        {/* ========================= */}
        {/* ITEMS */}
        {/* ========================= */}
        {items.map((it, idx) => (
          <div key={idx} style={{ border: '1px solid #ddd', padding: 8, margin: 6 }}>
            <input
              placeholder="SO2"
              value={it.pollutant}
              onChange={e => updateItem(idx, 'pollutant', e.target.value)}
            />

            <input
              type="number"
              value={it.amount}
              onChange={e => updateItem(idx, 'amount', parseFloat(e.target.value))}
            />

            <select
              value={it.amountUnit}
              onChange={e => updateItem(idx, 'amountUnit', e.target.value)}
            >
              <option value="t">t</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>

            <input
              type="number"
              value={it.rate}
              onChange={e => updateItem(idx, 'rate', parseFloat(e.target.value))}
            />

            <input
              type="number"
              step="0.01"
              value={it.kTime}
              onChange={e => updateItem(idx, 'kTime', parseFloat(e.target.value))}
            />

            <input
              type="number"
              step="0.01"
              value={it.kRegion}
              onChange={e => updateItem(idx, 'kRegion', parseFloat(e.target.value))}
            />

            <input
              type="number"
              step="0.01"
              value={it.kBenefit}
              onChange={e => updateItem(idx, 'kBenefit', parseFloat(e.target.value))}
            />

            <button type="button" onClick={() => removeItem(idx)}>
              Видалити
            </button>
          </div>
        ))}

        {/* ========================= */}
        {/* SUBMIT */}
        {/* ========================= */}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Вираховується...' : 'Розрахувати'}
          </button>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>

      {result && <EcoTaxResult result={result} />}
    </div>
  );
}
