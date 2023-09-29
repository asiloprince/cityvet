import configs from "./global.configs.js";

export default {
  dispersal_id: {
    ...configs.id,
  },
  dispersal_date: {},
  status: {
    allowedValues: ["Yet to be Redispersed", "Redispersed"],
  },
  contract_details: {
    maxLength: 500,
  },
  redispersal_date: {},
  previousBeneficiaryId: {},
  redispersalBeneficiaryId: {},
  notes: {
    maxLength: 500,
  },
  dispersal_date: {},
};
