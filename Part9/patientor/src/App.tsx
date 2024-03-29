import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";

import patientService from "./services/patients";
import diagnosisService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import SinglePatientPage from "./components/SinglePatientPage";
import DiagnosisContext from "./DiagnosisContext";
import PatientsContext from "./PatientsContext";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  useEffect(() => {
    const fetchDiagnosesList = async () => {
      const patients = await diagnosisService.getAll();
      setDiagnoses(patients);
    };
    void fetchDiagnosesList();
  }, []);

  return (
    <DiagnosisContext.Provider value={diagnoses}>
      <PatientsContext.Provider value={[patients, setPatients]}>
        <div className="App">
          <Router>
            <Container>
              <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
                Patientor
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
              >
                Home
              </Button>
              <Divider hidden />
              <Routes>
                <Route
                  path="/"
                  element={
                    <PatientListPage
                      patients={patients}
                      setPatients={setPatients}
                    />
                  }
                />
                <Route path="/patients/:id" element={<SinglePatientPage />} />
              </Routes>
            </Container>
          </Router>
        </div>
      </PatientsContext.Provider>
    </DiagnosisContext.Provider>
  );
};

export default App;
