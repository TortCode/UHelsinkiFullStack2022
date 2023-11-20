import express from "express";
import diagnosesService from "../services/diagnosesService";

const router = express.Router();

router.get('/', (_req, res) => {
  const entries = diagnosesService.getDiagnoses();
  res.json(entries);
});


export default router;