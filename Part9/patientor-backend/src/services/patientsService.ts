import patients from '../../data/patients';
import { Patient, NewPatient, PatientWithoutSSN } from '../types';
import { v1 as uuid } from 'uuid';

const getPatientsWithoutSSN = (): PatientWithoutSSN[] => {
  return patients.map(({ssn: _ssn, ...others}) => ({
    ...others
  }));
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

export default {
    getPatientsWithoutSSN,
    addPatient
};