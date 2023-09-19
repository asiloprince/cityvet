import validator from "validator";
import usersConfigs from "../../db/configs/users.config.js";

import { isString, isStringEmpty } from "../../global/utils/validator.js";
import { isEmailRegistered } from "./authentications.utils.js";

export async function validateUserRegistrationPayload(req, res, next) {
  const { firstName, lastName, email, password, roleType } = req.body;

  if (!isString(firstName)) {
    return res.send({
      success: false,
      message: "First name must be a string.",
    });
  }

  if (isStringEmpty(firstName)) {
    return res.send({ success: false, message: "First name is required." });
  }

  if (firstName.length > usersConfigs.first_name.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for a first name.",
    });
  }

  //   Last Name

  if (!isString(lastName)) {
    return res.send({ success: false, message: "Last name must be a string" });
  }

  if (isStringEmpty(lastName)) {
    return res.send({ success: false, message: "Last name is required" });
  }

  if (lastName.length > usersConfigs.last_name.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for a last name",
    });
  }

  // Email

  if (!isString(email)) {
    return res.send({ success: false, message: "Email must be a string" });
  }

  if (!validator.isEmail(email)) {
    return res.send({
      success: false,
      message: "Please provide a valid email",
    });
  }

  if (email.length > usersConfigs.email.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for an email address",
    });
  }

  if (email.length < usersConfigs.email.minLength) {
    return res.send({
      success: false,
      message: "Too few characters for an email address",
    });
  }

  let isEmailUsed;

  try {
    isEmailUsed = await isEmailRegistered(email);
  } catch (err) {
    console.error(err);
    return res.send({ success: false, message: err.message });
  }

  if (isEmailUsed) {
    return res.send({
      success: false,
      message: "Email is already registered. Try signing in",
    });
  }

  // Password

  if (!isString(password)) {
    return res.send({ success: false, message: "Password must be a string" });
  }

  if (isStringEmpty(password)) {
    return res.send({ success: false, message: "Password is required" });
  }

  const isPasswordLengthInRange =
    password.length <= usersConfigs.password.maxLength &&
    password.length >= usersConfigs.password.minLength;

  if (!isPasswordLengthInRange) {
    return res.send({
      success: false,
      message: `Password must consist of ${usersConfigs.password.minLength} to ${usersConfigs.password.maxLength} characters.`,
    });
  }
  next();

  // role type
  if (!isString(roleType)) {
    return res.status({ success: false, message: "Role type must be String" });
  }
  if (isStringEmpty(roleType)) {
    return res.send({ success: false, message: "Please select a role" });
  }

  if (!usersConfigs.role.allowedValues.includes(roleType)) {
    return res.send({
      success: false,
      message: `Role type ${roleType} is not valid.`,
    });
  }
}

export async function validateLoginPayload(req, res, next) {
  const { email, password } = req.body;

  // email

  if (!isString(email)) {
    return res.send({
      success: false,
      message: "Email must be a string",
    });
  }

  if (isStringEmpty(email)) {
    return res.send({ success: false, message: "Email address is required" });
  }

  if (!validator.isEmail(email)) {
    return res.send({
      success: false,
      message: "The email address you provided is not a valid email address",
    });
  }

  let isEmailUsed;

  try {
    isEmailUsed = await isEmailRegistered(email);
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }

  if (!isEmailUsed) {
    return res.send({
      success: false,
      message:
        "The email you provided is not registered. Try signing up instead.",
    });
  }

  // password

  if (!isString(password)) {
    return res.send({
      success: false,
      message: "Password must be a string",
    });
  }

  if (isStringEmpty(password)) {
    return res.send({ success: false, message: "Password is required" });
  }
  next();
}
