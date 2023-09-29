import configs from "./global.configs.js";

export default {
  user_id: {
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
};
