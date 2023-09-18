import express from "express";
import { handleUserRegistration } from "./authentications.handlers.js";
import { validateUserRegistrationPayload } from "./authentications.middlewares.js";

const router = express.Router();

router.post(
  "/register",
  validateUserRegistrationPayload,
  handleUserRegistration
);

export default router;
