require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const EcoTaxItem = require('../models/EcoTaxItem');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const data = JSON.parse(
    fs.readFileSync(__dirname + '/seed.ecotax.json')
  );

  await EcoTaxItem.insertMany(data);

  console.log('EcoTax items imported:', data.length);
  process.exit();
}

run();
