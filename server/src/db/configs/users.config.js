import configs from "./global.config";

export default {
  userId: {
    ...configs.id,
  },
  name: {
    ...configs.name,
  },
  email: {
    maxLength: 100,
    minLength: 6, //sample case: ae@a.a
  },
  password: {
    minLength: 6,
    maxLength: 16,
  },
  role: {
    allowedValues: [
      "Administrator",
      "Program Manager",
      "Livestock Coordinator",
      "Beneficiaries Coordinator",
    ],
  },
};
