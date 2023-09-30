import express from "express";
import {
  handleLivestockDispersal,
  handleGetDispersalInfo,
  handleDeleteDispersalRecord,
  handleGetDispersalList,
  handleUpdateDispersalData,
  handleRedispersalStarter,
  handleRedispersalOffspring,
} from "./single.dispersions.handlers.js";

const router = express.Router();

router.get("/", handleGetDispersalList);
router.get("/:dispersal_id", handleGetDispersalInfo);
router.post("/add", handleLivestockDispersal);
router.post("/redisperse/:dispersal_id", handleRedispersalStarter);
router.post("/redisperse", handleRedispersalOffspring);
router.put("/update/:dispersal_id", handleUpdateDispersalData);
router.delete("/delete/:dispersal_id", handleDeleteDispersalRecord);

export default router;
