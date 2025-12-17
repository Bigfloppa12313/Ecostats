const express = require('express');
const router = express.Router();

const EcoTaxItem = require('../models/EcoTaxItem');
const EcoTaxReport = require('../models/EcoTaxReport');

const { EcoTaxPayload } = require('../validators/ecotaxValidator');
const { computeEcoTax } = require('../compute/computeEcoTax');

router.post('/calc', async (req, res) => {
  try {
    const parsed = EcoTaxPayload.parse(req.body);

    // compute
    const result = computeEcoTax({ items: parsed.items });

    // save items
    const createdItems = await Promise.all(
      parsed.items.map(async it => {
        const normalizedAmount =
          it.amountUnit === 'kg'
            ? it.amount / 1000
            : it.amountUnit === 'g'
            ? it.amount / 1e6
            : it.amount;

        const subtotal = Number(
          (normalizedAmount * it.rate * it.kTime * it.kRegion * it.kBenefit).toFixed(2)
        );

        return EcoTaxItem.create({
          period: parsed.period,
          objectType: parsed.objectType || 'unknown',
          pollutant: it.pollutant,
          amount: normalizedAmount,
          amountUnit: 't',
          rate: it.rate,
          kTime: it.kTime,
          kRegion: it.kRegion,
          kBenefit: it.kBenefit,
          subtotal
        });
      })
    );

    // save report
    const report = await EcoTaxReport.create({
      period: parsed.period,
      items: createdItems.map(d => d._id),
      total: result.data.total,
      passport: result.data.passport
    });

    res.json({
      success: true,
      data: result.data,
      savedReportId: report._id
    });
  } catch (err) {
    console.error('🔥 calc error:', err);

    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, error: err.errors });
    }

    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/objects', async (req, res) => {
  try {
    const objects = await EcoTaxItem.aggregate([
      {
        $group: {
          _id: {
            period: '$period',
            objectType: '$objectType'
          }
        }
      },
      {
        $project: {
          _id: 0,
          period: '$_id.period',
          objectType: '$_id.objectType'
        }
      },
      { $sort: { period: -1 } }
    ]);

    res.json({ success: true, data: objects });
  } catch (err) {
    console.error('🔥 objects error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/items', async (req, res) => {
  try {
    const { period, objectType } = req.query;
    if (!period || !objectType) {
      return res
        .status(400)
        .json({ success: false, error: 'period & objectType required' });
    }

    const items = await EcoTaxItem.find({ period, objectType }).lean();

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 items error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
