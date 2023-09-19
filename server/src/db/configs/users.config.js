import configs from "./global.config.js";

export default {
  userId: {
    ...configs.id,
  },
  first_name: {
    ...configs.name,
  },
  last_name: {
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
  roles: {
    allowedValues: ["Admin", "Program Manager", "Coordinator"],
  },
};
