import express from "express";
import {
  handleLivestockRegistration,
  handleGetLivestockInfo,
  handleGetLivestockList,
  handleUpdateLivestockRecord,
  handleDeleteLivestockRecord,
} from "./livestocks.handlers.js";
import {
  validateLivestocksPayload,
  validateEartagPayload,
} from "./livestocks.middlewares.js";

const router = express.Router();

router.post(
  "/add",
  validateEartagPayload,
  validateLivestocksPayload,
  handleLivestockRegistration
);
router.get("/", handleGetLivestockList);
router.get("/details/:livestock_id", handleGetLivestockInfo);
router.delete("/delete/:livestock_id", handleDeleteLivestockRecord);
router.put(
  "/update/:livestock_id",
  validateLivestocksPayload,
  handleUpdateLivestockRecord
);

export default router;
