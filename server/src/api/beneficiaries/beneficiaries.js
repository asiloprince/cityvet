import express from "express";
import {
  getBeneficiaries,
  addNewBeneficiaries,
} from "./beneficiaries.handler.js";

const router = express.Router();

router.get("/beneficiaries", getBeneficiaries);
router.post("/add/beneficiaries", addNewBeneficiaries);

export default router;
