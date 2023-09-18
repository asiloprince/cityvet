import express from "express";
import {
  handleUserRegistration,
  handleLogin,
  handleIsAuth,
  handleLogout,
} from "./authentications.handlers.js";
import {
  validateUserRegistrationPayload,
  validateLoginPayload,
} from "./authentications.middlewares.js";

const router = express.Router();

router.post(
  "/register",
  validateUserRegistrationPayload,
  handleUserRegistration
);

router.post("/login", validateLoginPayload, handleLogin);
router.delete("/logout", handleLogout);
export default router;
