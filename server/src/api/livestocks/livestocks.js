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
router.get("/details/:livestockId", handleGetLivestockInfo);
router.delete("/delete/:livestockId", handleDeleteLivestockRecord);
router.put(
  "/update/:livestockId",
  validateLivestocksPayload,
  handleUpdateLivestockRecord
);

export default router;
