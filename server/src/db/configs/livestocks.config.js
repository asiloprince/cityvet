import configs from "./global.configs.js";

export default {
  livestock_id: {
    ...configs.id,
  },
  breed: {
    maxLength: 100,
    minLength: 6,
  },
  type: {
    allowedValues: ["Swine", "Cattle", "Goat"],
  },
  category: {
    allowedValues: [
      "CPDO Cattle",
      "Cattle",
      "Goat - Doe",
      "Goat - Buck",
      "Swine",
    ],
  },
  age: {
    maxLength: 30,
  },
  health: {
    allowedValues: ["Excellent", "Good", "Fair", "Poor", "Not set"],
  },
  status: {
    allowedValues: ["Dispersed", "Redispersed", "Not Dispersed"],
  },
  isAlive: {
    allowedValues: ["Yes", "No"],
  },
};
