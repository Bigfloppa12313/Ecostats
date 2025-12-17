const mongoose = require('mongoose');

const EcoTaxItemSchema = new mongoose.Schema({
  period: { type: String, required: true }, // 2025-09
  objectType: { type: String, required: true },
  pollutant: { type: String, required: true },
  amount: { type: Number, required: true }, // зберігаємо в тоннах
  amountUnit: { type: String, default: 't' }, 
  rate: { type: Number, required: true }, // грн / т
  kTime: { type: Number, required: true, min: 0 },
  kRegion: { type: Number, required: true, min: 0 },
  kBenefit: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true }, // грн
}, { timestamps: true });

EcoTaxItemSchema.index({ period: 1, objectType: 1, pollutant: 1 });

module.exports = mongoose.model('EcoTaxItem', EcoTaxItemSchema);
