const mongoose = require('mongoose');

const EcoTaxReportSchema = new mongoose.Schema({
  period: { type: String, required: true },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'EcoObject', required: false },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EcoTaxItem' }],
  total: { type: Number, required: true },
  passport: { // одиниці, версія довідників, коефіцієнти
    inputUnits: { type: Object, default: {} },
    usedRatesVersion: { type: String, default: 'v1' },
    usedCoefficients: { type: Object, default: {} }
  }
}, { timestamps: true });

EcoTaxReportSchema.index({ period: 1, objectId: 1 });

module.exports = mongoose.model('EcoTaxReport', EcoTaxReportSchema);
