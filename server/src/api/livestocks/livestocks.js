import express from "express";
import {
  handleLivestockRegistration,
  handleGetLivestockInfo,
  handleGetLivestockList,
  handleUpdateLivestockRecord,
  handleDeleteLivestockRecord,
  handleDispersedLivestockList,
} from "./livestocks.handlers.js";
import {
  validateLivestocksPayload,
  validateEartagPayload,
} from "./livestocks.middlewares.js";
import { validateAuthCookie } from "../../global/middlewares/authorizations.js";

const router = express.Router();

router.post(
  "/add",
  validateEartagPayload,
  validateLivestocksPayload,
  handleLivestockRegistration
);
router.get("/", validateAuthCookie, handleGetLivestockList);
router.get("/undispersed", validateAuthCookie, handleDispersedLivestockList);
router.get(
  "/details/:livestock_id",
  validateAuthCookie,
  handleGetLivestockInfo
);
router.delete(
  "/delete/:livestock_id",
  validateAuthCookie,
  handleDeleteLivestockRecord
);
router.put(
  "/update/:livestock_id",
  validateAuthCookie,
  validateLivestocksPayload,
  handleUpdateLivestockRecord
);

export default router;
