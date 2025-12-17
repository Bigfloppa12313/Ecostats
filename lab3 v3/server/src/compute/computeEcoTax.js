function normalizeAmount(amount, unit) {

  if (!unit) return amount;
  const u = unit.toLowerCase();
  if (u === 't' || u === 'ton' || u === 'тонн') return amount;
  if (u === 'kg') return amount / 1000;
  if (u === 'g') return amount / 1e6;
  return amount;
}

function validateItem(item) {
  if (typeof item.amount !== 'number' || item.amount < 0) throw new Error('amount must be >= 0');
  if (typeof item.rate !== 'number' || item.rate <= 0) throw new Error('rate must be > 0');
  ['kTime','kRegion','kBenefit'].forEach(k=>{
    if (typeof item[k] !== 'number' || item[k] <= 0) throw new Error(`${k} must be > 0`);
  });
}

function computeEcoTax(payload) {
  if (!payload || !Array.isArray(payload.items)) {
    throw new Error('payload.items required');
  }

  const itemsOut = [];
  let total = 0;

  payload.items.forEach((rawItem, idx) => {
    const item = { ...rawItem };
    // нормалізуємо одиниці до тонн
    const normalizedAmount = normalizeAmount(item.amount, item.amountUnit || 't');
    item.amountNormalized = normalizedAmount; // т

    validateItem(item);

    const subtotal = normalizedAmount * item.rate * item.kTime * item.kRegion * item.kBenefit;
    item.subtotal = Number(subtotal.toFixed(2));
    itemsOut.push(item);
    total += subtotal;
  });

  total = Number(total.toFixed(2));

  const passport = {
    inputUnits: { /* return units as provided */ },
    normalization: {
      amountUnit: 't (tons)',
      note: 'amounts normalized to tonnes before calculation'
    },
    timestamp: new Date().toISOString()
  };

  return {
    success: true,
    data: {
      items: itemsOut,
      total,
      passport
    }
  };
}

module.exports = {
  computeEcoTax,
  _internal: { normalizeAmount, validateItem }
};
