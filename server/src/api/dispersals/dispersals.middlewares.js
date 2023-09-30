import dispersalsConfigs from "../../db/configs/dispersals.configs.js";
import dispersedLivestocksConfigs from "../../db/configs/dispersed-livestocks.configs.js";
import {
  isArray,
  isString,
  isStringEmpty,
} from "../../global/utils/validator.js";
import validator from "validator";

export async function validateDispersedLivestock(req, res, next) {
  const { quantity } = req.body;

  // quantity
  if (!isString(quantity)) {
    return res.send({
      success: false,
      message: "Quantity mus be string",
    });
  }
  if (isStringEmpty(quantity)) {
    return res.send({
      success: false,
      message: "Quantity is required.",
    });
  }

  if (!validator.isNumeric(quantity)) {
    return res.send({
      success: false,
      message: "Please input valid quantity",
    });
  }
}

export async function validateLivestockDispersalsPayload(req, res, next) {
  const { dispersalDate, status, contractDetails, redispersalDate, notes } =
    req.body;
  //   dispersalDate
  if (!isString(dispersalDate)) {
    return res.send({
      success: false,
      message: "Dispersalmust be a string.",
    });
  }
  if (isStringEmpty(dispersalDate)) {
    return res.send({
      success: false,
      message: "Dispersal Date is required",
    });
  }
  if (!validator.isDate(dispersalDate)) {
    return res.send({
      success: false,
      message:
        "Date format is not valid. The required date format is YYYY-MM-DD",
    });
  }
  //   status
  if (!isString(status)) {
    return res.send({
      success: false,
      message: "status must be string",
    });
  }

  if (isStringEmpty(status)) {
    return res.send({
      success: false,
      message: "Dispersal status is required.",
    });
  }
  if (dispersalsConfigs.status.allowedValues.includes(status)) {
    return res.send({
      success: false,
      message: `livestock status ${status} is not valid.`,
    });
  }
  //   contractDetails
  if (!isString(contractDetails)) {
    return res.send({
      success: false,
      message: "Contract Details must be string.",
    });
  }
  if (contractDetails.length > dispersalsConfigs.contractDetails.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for a Ear tag.",
    });
  }
  //   redispersalDate
  if (!isString(redispersalDate)) {
    return res.send({
      success: false,
      message: "Redispersal must be a string.",
    });
  }

  if (!validator.isDate(redispersalDate)) {
    return res.send({
      success: false,
      message:
        "Date format is not valid. The required date format is YYYY-MM-DD",
    });
  }
  //   notes
  if (!isString(notes)) {
    return res.send({
      success: false,
      message: "Notes must be string.",
    });
  }
  if (contractDetails.length > dispersalsConfigs.contractDetails.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for a Ear tag.",
    });
  }
  next();
}
