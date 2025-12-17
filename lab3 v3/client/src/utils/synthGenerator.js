export function rand(min, max, decimals = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

const pollutants = ['SO2','NOx','PM10','CO','VOC','NH3','Pb','Cd'];

export function generateItems(count = 3, scenario = 'basic') {
  const items = [];
  for (let i=0;i<count;i++){
    const pollutant = pollutants[Math.floor(Math.random()*pollutants.length)];
    const scenarioCoeffs = {
      basic: { kTime: 1, kRegion: 1, kBenefit: 1 },
      city: { kTime: 1.2, kRegion: 1.5, kBenefit: 1 },
      benefit: { kTime: 1, kRegion: 1, kBenefit: 0.5 }
    }[scenario] || { kTime:1, kRegion:1, kBenefit:1 };

    items.push({
      pollutant,
      amount: rand(0.1, 500, 3),
      amountUnit: 't',
      rate: rand(10, 50000, 2),
      kTime: scenarioCoeffs.kTime,
      kRegion: scenarioCoeffs.kRegion,
      kBenefit: scenarioCoeffs.kBenefit
    });
  }
  return items;
}
