const { z } = require('zod');

const EcoTaxItemSchema = z.object({
  pollutant: z.string().min(1),
  amount: z.number().nonnegative(),
  amountUnit: z.string().optional(), // t | kg | g
  rate: z.number().positive(),
  kTime: z.number().positive(),
  kRegion: z.number().positive(),
  kBenefit: z.number().positive()
});

const EcoTaxPayload = z.object({
  period: z.string().min(1),
  objectType: z.string().optional(),
  items: z.array(EcoTaxItemSchema).min(1)
});

module.exports = { EcoTaxPayload, EcoTaxItemSchema };
