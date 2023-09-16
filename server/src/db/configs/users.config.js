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
  },
  role: {
    allowedValues: ["admin", "employee"],
  },
};
