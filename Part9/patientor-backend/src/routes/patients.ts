import express from 'express';
import patientsService from '../services/patientsService';

import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getPatientsWithoutSSN();
  res.json(patients);
});

router.post('/', (req, res) => {
  const newPatient = toNewPatient(req.body);
  const addedPatient = patientsService.addPatient(newPatient);
  res.status(201).json(addedPatient);
});

export default router;