import configs from "./global.configs.js";

export default {
  dispersedLivestockId: {
    ...configs.id,
  },
  quantity: {
    min: 1, // custom, not a database metadata
    max: 1000, // custom, not a database metadata
  },
};
