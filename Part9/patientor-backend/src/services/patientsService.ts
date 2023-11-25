import patients from '../../data/patients';
import { Patient, NewPatient, NonSensitivePatient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const toNonSensitivePatient = ({ssn: _ssn, entries: _entries, ...others}: Patient): NonSensitivePatient => (others);

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(toNonSensitivePatient);
};

const getPatientById = (id: string): Patient | null => {
  const patient = patients.find(p => p.id === id);
  if (!patient) return null;
  return patient;
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const addedPatient: Patient = {
    id, 
    ...patient
  };

  patients.push(addedPatient);
  return addedPatient;
};

const addEntry = (id: string, newEntry: NewEntry): Entry | null => {
  const patient = patients.find(p => p.id === id);
  if (!patient) return null;
  const entry = {
    id: uuid(),
    ...newEntry
  };
  patient.entries.push(entry);
  return entry;
};

export default {
    getPatients,
    getPatientById,
    addPatient,
    addEntry
};