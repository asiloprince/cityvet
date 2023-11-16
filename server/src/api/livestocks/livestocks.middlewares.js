import eartagsConfigs from "../../db/configs/eartags.configs.js";
import livestocksConfig from "../../db/configs/livestocks.config.js";
import validator from "validator";

import { isString, isStringEmpty } from "../../global/utils/validator.js";

export async function validateLivestocksPayload(req, res, next) {
  const { type, category, breed, age, health, status } = req.body;

  //  type
  if (!isString(type)) {
    return res.send({
      success: false,
      message: "Livestock type must be string.",
    });
  }

  if (isStringEmpty(type)) {
    return res.send({
      success: false,
      message: "Livestock Type is required.",
    });
  }
  if (!livestocksConfig.type.allowedValues.includes(type)) {
    return res.send({
      success: false,
      message: `livestock type ${type} is not valid.`,
    });
  }
  //  category
  if (!isString(category)) {
    return res.send({
      success: false,
      message: "Livestock Category must be string.",
    });
  }

  if (isStringEmpty(category)) {
    return res.send({
      success: false,
      message: "Livestock Category is required.",
    });
  }
  if (!livestocksConfig.category.allowedValues.includes(category)) {
    return res.send({
      success: false,
      message: `livestock category type ${category} is not valid.`,
    });
  }

  //breed
  // if (!isString(breed)) {
  //   return res.send({
  //     success: false,
  //     message: "Breed must be string.",
  //   });
  // }

  // if (isStringEmpty(breed)) {
  //   return res.send({
  //     success: false,
  //     message: "Livestock Type is required.",
  //   });
  // }

  // if (breed.length > livestocksConfig.breed.maxLength) {
  //   return res.send({
  //     success: false,
  //     message: "Too many characters for a breed.",
  //   });
  // }
  // if (breed.length < livestocksConfig.breed.minLength) {
  //   return res.send({
  //     success: false,
  //     message: "Too few characters for a breed.",
  //   });
  // }

  //   age
  if (!isString(age)) {
    return res.send({
      success: false,
      message: "age must be string.",
    });
  }

  if (isStringEmpty(age)) {
    return res.send({
      success: false,
      message: "age is required.",
    });
  }
  // if (!validator.isInt(age)) {
  //   return res.send({
  //     success: false,
  //     message: "age is invalid. It must contain numbers only.",
  //   });
  // }

  //health
  if (!isString(health)) {
    return res.send({
      success: false,
      message: "Livestock health must be string.",
    });
  }

  if (isStringEmpty(health)) {
    return res.send({
      success: false,
      message: "Livestock health is required.",
    });
  }
  if (!livestocksConfig.health.allowedValues.includes(health)) {
    return res.send({
      success: false,
      message: `livestock health type ${health} is not valid.`,
    });
  }

  //status

  // if (!isString(status)) {
  //   return res.send({
  //     success: false,
  //     message: "Livestock status must be string.",
  //   });
  // }

  // if (isStringEmpty(status)) {
  //   return res.send({
  //     success: false,
  //     message: "Livestock status is required.",
  //   });
  // }
  // if (!livestocksConfig.status.allowedValues.includes(status)) {
  //   return res.send({
  //     success: false,
  //     message: `livestock status type ${status} is not valid.`,
  //   });
  // }
  next();
}

export async function validateEartagPayload(req, res, next) {
  const { ear_tag } = req.body;

  // eartag validation

  if (!isString(ear_tag)) {
    return res.send({ success: false, message: "Ear tag must be string." });
  }

  if (isStringEmpty(ear_tag)) {
    return res.send({ success: false, message: "Ear tag is required." });
  }

  if (ear_tag.length > eartagsConfigs.ear_tag.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for a Ear tag.",
    });
  }
  next();
}
