import express from "express";
import {
  handleBeneficiariesByGender,
  handleDispersalsAndRedispersal,
  handleDispersalsPrediction,
  handleDisperseLivestocksStackBar,
  handleLivestockHealthStatus,
  handleTotalDispersalAndRedispersal,
  handleTotalivestockForEachType,
} from "./key.performance.indicators.handlers.js";

const router = express.Router();

router.get("/dispersals-redispersals", handleDispersalsAndRedispersal);
router.get("/dispersals-prediction", handleDispersalsPrediction);
router.get("/livestocks/total", handleTotalivestockForEachType);
router.get("/beneficiaries/gender", handleBeneficiariesByGender);
router.get("/disperse-livestocks/bar", handleDisperseLivestocksStackBar);
router.get("/livestocks/health-status", handleLivestockHealthStatus);
router.get("/dispersals/total", handleTotalDispersalAndRedispersal);

export default router;
