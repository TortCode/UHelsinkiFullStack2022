import { useContext, useEffect, useState } from "react";
import { EntryFormValues, Gender, Patient } from "../../types";
import {
  Card,
  Divider,
  Stack,
  Typography,
  CardContent,
  Button,
} from "@mui/material";
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  Transgender as TransgenderIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";

import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddEntryModel";
import PatientsContext from "../../PatientsContext";

const SinglePatientPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const [patient, setPatient] = useState<Patient | undefined | null>(undefined);
  const [patients, setPatients] = useContext(PatientsContext)!;

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

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (!patient) {
        throw new Error("Patient not found");
      }
      const entry = await patientService.createEntry(patient.id, values);
      const newEntries = patient.entries.concat(entry);
      const newPatient = { ...patient, entries: newEntries };
      setPatient(newPatient);
      setPatients(
        patients.map((p) => (p.id === newPatient.id ? newPatient : p))
      );
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data;
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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
    <div style={{ marginTop: "1em", }}> 
      <Typography variant="h4">
        {patient.name} {getGenderIcon(patient.gender)}
      </Typography>
      {patient.dateOfBirth && (
        <Typography>Born: {patient.dateOfBirth}</Typography>
      )}
      {patient.ssn && <Typography>SSN: {patient.ssn}</Typography>}
      <Typography>Occupation: {patient.occupation}</Typography>
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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()} sx={{ mt: '1em'}}>
        Add New Entry
      </Button>
    </div>
  );
};

export default SinglePatientPage;
