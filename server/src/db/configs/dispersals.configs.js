import configs from "./global.configs.js";

export default {
  dispersalId: {
    ...configs.id,
  },
  dispersalDate: {},
  status: {
    allowedValues: ["Yet to be Redispersed", "Redispersed"],
  },
  contractDetails: {
    maxLength: 500,
  },
  redispersalDate: {},
  previousBeneficiaryId: {},
  redispersalBeneficiaryId: {},
  notes: {
    maxLength: 500,
  },
  dispersal_date: {},
};
