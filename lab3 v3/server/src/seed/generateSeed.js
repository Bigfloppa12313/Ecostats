const fs = require('fs');
const path = require('path');

const pollutants = ['SO2','NOx','PM10','CO','VOC','NH3','Pb','Cd'];

function rand(min, max, decimals = 2) {
  const r = Math.random() * (max - min) + min;
  return Number(r.toFixed(decimals));
}

function generateRecord(period, objectType) {
  const count = Math.floor(rand(3,5,0));
  const items = [];
  for (let i=0;i<count;i++){
    items.push({
      period,
      objectType,
      pollutant: pollutants[Math.floor(Math.random()*pollutants.length)],
      amount: rand(0.1, 500, 3), // т
      amountUnit: 't',
      rate: rand(10, 50000, 2),
      kTime: rand(0.1, 3, 3),
      kRegion: rand(0.1, 3, 3),
      kBenefit: rand(0.1, 1, 3)
    });
  }
  return items;
}

function generateSeed(totalRecords = 20) {
  const out = [];
  const periods = ['2024-12','2025-01','2025-02'];
  const objectTypes = ['Factory A','Plant B','Warehouse C','Municipal D'];

  for (let i=0;i<totalRecords;i++){
    const period = periods[Math.floor(Math.random()*periods.length)];
    const obj = objectTypes[Math.floor(Math.random()*objectTypes.length)];
    out.push(...generateRecord(period, obj));
  }

  return out;
}

const data = generateSeed(30);
fs.writeFileSync(path.join(__dirname,'seed.ecotax.json'), JSON.stringify(data, null, 2));
console.log('Seed generated, count=', data.length);
