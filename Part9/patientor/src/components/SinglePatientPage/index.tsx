import React, { useContext, useEffect, useState } from "react";
import {
  BaseEntry,
  Entry,
  Gender,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
  assertNever,
} from "../../types";
import {
  Card,
  List,
  ListItem,
  Divider,
  Stack,
  Typography,
  CardContent,
} from "@mui/material";
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  Transgender as TransgenderIcon,
  LocalHospitalOutlined as HospitalIcon,
  MonitorHeartOutlined as HealthCheckIcon,
  WorkOutlineOutlined as OccupationalHealthcareIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";

import patientService from "../../services/patients";
import DiagnosisContext from "../../DiagnosisContext";
import HealthRatingBar from "../HealthRatingBar";

const BaseEntryDetails: React.FC<{ entry: BaseEntry; icon: JSX.Element }> = ({
  entry,
  icon,
}) => {
  const diagnoses = useContext(DiagnosisContext);
  return (
    <>
      <Typography >
        {entry.date} {icon}
      </Typography>
      <Typography >
        <em>{entry.description}</em>
      </Typography>
      {entry.specialist && (
        <Typography >Diagnosed by {entry.specialist}</Typography>
      )}
      <List>
        {entry.diagnosisCodes?.map((code) => (
          <ListItem key={code}>
            <Typography variant="body2">
              {code} {diagnoses.find((d) => d.code === code)?.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({
  entry,
}) => {
  return (
    <>
      <BaseEntryDetails entry={entry} icon={<HealthCheckIcon />} />
      <Divider sx={{ mt: ".5em", mb: ".5em" }} />
      <Typography>
        <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
      </Typography>
    </>
  );
};
const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({
  entry,
}) => {
  return (
    <>
      <BaseEntryDetails
        entry={entry}
        icon={<HospitalIcon fontSize="medium" />}
      />
      <Divider sx={{ mt: ".5em", mb: ".5em" }} />
      <Typography >
        Discharged on {entry.discharge.date} because {entry.discharge.criteria}
      </Typography>
    </>
  );
};
const OccupationalHealthcareEntryDetails: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <>
      <BaseEntryDetails entry={entry} icon={<OccupationalHealthcareIcon />} />
      <Divider sx={{ mt: ".5em", mb: ".5em" }} />
      <Typography >Employed by {entry.employerName}</Typography>
      {entry.sickLeave && (
        <Typography >
          Leave from {entry.sickLeave.startDate} to 
          {entry.sickLeave.endDate}
        </Typography>
      )}
    </>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const SinglePatientPage = () => {
  const [patient, setPatient] = useState<Patient | undefined | null>(undefined);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id) {
          const patient = await patientService.getById(id);
          setPatient(patient);
        } else {
          setPatient(null);
        }
      } catch (e: unknown) {
        console.error(e);
        if (axios.isAxiosError(e)) {
          if (e?.response?.status === 404) {
            setPatient(null);
          }
        }
      }
    };
    fetchPatient();
  }, [id]);

  if (patient === undefined) {
    return <Typography variant="h3">Loading...</Typography>;
  }

  if (patient === null) {
    return <Typography variant="h3">Patient not found</Typography>;
  }

  const getGenderIcon = (gender: Gender): JSX.Element => {
    switch (gender) {
      case Gender.Male:
        return <MaleIcon fontSize="large" />;
      case Gender.Female:
        return <FemaleIcon fontSize="large" />;
      case Gender.Other:
        return <TransgenderIcon fontSize="large" />;
    }
  };

  return (
    <div style={{ marginTop: "1em" }}>
      <Typography variant="h4">
        {patient.name} {getGenderIcon(patient.gender)}
      </Typography>
      {patient.dateOfBirth && (
        <Typography >Born: {patient.dateOfBirth}</Typography>
      )}
      {patient.ssn && (
        <Typography >SSN: {patient.ssn}</Typography>
      )}
      <Typography >Occupation: {patient.occupation}</Typography>
      <Divider sx={{ mt: "1em", mb: "1em" }} />
      <Stack spacing={1}>
        {patient.entries.map((entry) => (
          <Card key={entry.id} variant="outlined">
            <CardContent>
              <EntryDetails entry={entry} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </div>
  );
};

export default SinglePatientPage;
