import { ErrorRequestHandler } from "express";
import { Diagnosis, Gender, HealthCheckRating, NewEntry, NewPatient } from "./types";

export const isString = (text: unknown): text is string => {
  return typeof (text) === 'string' || text instanceof String;
};

export const isDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};

export const isNumber = (num: unknown): num is number => {
  return typeof (num) === 'number' || num instanceof Number;
};

export const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(gender);
};

export const isHealthCheckRating = (rating: number): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name: " + name);
  }
  return name;
};

const parseDateOfBirth = (dob: unknown): string => {
  if (!isString(dob) || !isDate(dob)) {
    throw new Error("Incorrect or missing date: " + dob);
  }
  return dob;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn: " + ssn);
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation: " + occupation);
  }
  return occupation;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!(
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  )) {
    throw new Error("Incorrect or missing data");
  }

  return {
    name: parseName(object.name),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: [],
  };
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Incorrect or missing description: " + description);
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Incorrect or missing specialist: " + specialist);
  }
  return specialist;
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnosis['code']> =>  {
  if (!codes || typeof codes !== 'object' || !('diagnosisCodes' in codes)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return codes.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isNumber(rating) || !isHealthCheckRating(rating)) {
    throw new Error("Incorrect or missing health check rating: " + rating);
  }
  return rating;
};

const parseCriteria = (criteria: unknown): string => {
  if (!isString(criteria)) {
    throw new Error("Incorrect or missing criteria: " + criteria);
  }
  return criteria;
};

const parseDischarge = (discharge: unknown): { date: string, criteria: string } => {
  if (!discharge || typeof discharge !== 'object') {
    throw new Error("Incorrect or missing discharge: " + discharge);
  }
  if (!('date' in discharge && 'criteria' in discharge)) {
    throw new Error("Incorrect or missing discharge: " + JSON.stringify(discharge));
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseCriteria(discharge.criteria),
  };
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName)) {
    throw new Error("Incorrect or missing employer name: " + employerName);
  }
  return employerName;
};

const parseSickLeave = (sickLeave: unknown): { startDate: string, endDate: string } => {
  if (!sickLeave || typeof sickLeave !== 'object') {
    throw new Error("Incorrect or missing sick leave: " + sickLeave);
  }
  if (!('startDate' in sickLeave && 'endDate' in sickLeave)) {
    throw new Error("Incorrect or missing sick leave: " + JSON.stringify(sickLeave));
  }
  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate),
  };
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!(
    'type' in object &&
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'diagnosisCodes' in object
  )) {
    throw new Error("Incorrect or missing data");
  }

  const base = {
    description: parseDescription(object.description),
    date: parseDate(object.date),
    specialist: parseSpecialist(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (object.type) {
    case 'HealthCheck':
      if (!('healthCheckRating' in object)) {
        throw new Error("Incorrect or missing data");
      }
      return {
        ...base,
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case 'Hospital':
      if (!('discharge' in object)) {
        throw new Error("Incorrect or missing data");
      }
      return {
        ...base,
        type: 'Hospital',
        discharge: parseDischarge(object.discharge),
      };
    case 'OccupationalHealthcare':
      if (!('employerName' in object)) {
        throw new Error("Incorrect or missing data");
      }
      return {
        ...base,
        type: 'OccupationalHealthcare',
        employerName: parseEmployerName(object.employerName),
        sickLeave: ('sickLeave' in object) ? parseSickLeave(object.sickLeave) : undefined,
      };
    default:
      throw new Error("Invalid type");
  }
};

export const handleError: ErrorRequestHandler = (error, _req, res, next)=> {
  if (error instanceof Error && error.message.includes("Incorrect or missing")) {
    res.status(400).send(error.message);
    return;
  }
  next();
};
