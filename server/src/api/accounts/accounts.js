import express from "express";
import {
  isVetOfficeMember,
  validateAuthCookie,
} from "../../global/middlewares/authorizations.js";
import { handleGetUserInfo } from "./accounts.handler.js";

const router = express.Router();
router.get(
  "/user/details",
  validateAuthCookie,
  isVetOfficeMember,
  handleGetUserInfo
);
export default router;
