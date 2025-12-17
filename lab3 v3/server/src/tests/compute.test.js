const { computeEcoTax, _internal } = require('../compute/computeEcoTax');

test('normalize kg to tons', () => {
  expect(_internal.normalizeAmount(1000, 'kg')).toBeCloseTo(1);
});

test('simple compute', () => {
  const payload = {
    items: [
      { pollutant:'X', amount: 2, amountUnit: 't', rate: 1000, kTime:1, kRegion:1, kBenefit:1 }
    ]
  };
  const res = computeEcoTax(payload);
  expect(res.data.total).toBe(2000);
  expect(res.data.items[0].subtotal).toBe(2000);
});

test('throws on invalid rate', () => {
  expect(() => computeEcoTax({ items: [{ pollutant:'X', amount:1, amountUnit:'t', rate:0, kTime:1, kRegion:1, kBenefit:1 }] })).toThrow();
});
