import express from 'express';
import patientsService from '../services/patientsService';

import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getPatients();
  res.json(patients);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const patient = patientsService.getPatientById(id);
  if (!patient) {
    res.status(404).send(`Patient ${id} not found`);
  }
  res.json(patient);
});

router.post('/:id/entries', (req, res) => {
  const id = req.params.id;
  const newEntry = toNewEntry(req.body);
  const addedEntry = patientsService.addEntry(id, newEntry);
  if (!addedEntry) {
    res.status(404).send(`Patient ${id} not found`);
  }
  res.status(201).json(addedEntry);
});

router.post('/', (req, res) => {
  const newPatient = toNewPatient(req.body);
  const addedPatient = patientsService.addPatient(newPatient);
  res.status(201).json(addedPatient);
});

export default router;