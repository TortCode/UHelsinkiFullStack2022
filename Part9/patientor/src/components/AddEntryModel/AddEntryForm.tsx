import { useState, SyntheticEvent, useContext } from "react";

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
} from "@mui/material";

import { EntryFormValues, HealthCheckRating, assertNever } from "../../types";
import DiagnosisContext from "../../DiagnosisContext";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

type EntryTypes = EntryFormValues["type"];

const entryTypes: Array<{ value: EntryTypes; label: string }> = [
  { value: "HealthCheck", label: "Health Check" },
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
];

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const diagnoses = useContext(DiagnosisContext);
  const [type, setType] = useState<EntryTypes>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<string>>([]);

  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);

  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const type = Object.values(entryTypes).find((e) => e.value === value);
      if (type) {
        setType(type.value);
      }
    }
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const healthCheckRating = Object.keys(HealthCheckRating).find(
        (v) => !isNaN(Number(v)) && v === value
      );
      if (healthCheckRating) {
        setHealthCheckRating(Number(value));
      }
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const object = {
      date,
      description,
      specialist,
      diagnosisCodes,
    };

    switch (type) {
      case "HealthCheck":
        onSubmit({
          ...object,
          type,
          healthCheckRating,
        });
        break;
      case "Hospital":
        onSubmit({
          ...object,
          type,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          ...object,
          type,
          employerName,
          sickLeave:
            sickLeaveStartDate && sickLeaveEndDate
              ? {
                  startDate: sickLeaveStartDate,
                  endDate: sickLeaveEndDate,
                }
              : undefined,
        });
        break;
      default:
        return assertNever(type);
    }
  };

  const HealthCheckSubcomponent = () => {
    return (
      <>
        <InputLabel style={{ marginTop: 20 }}>Health Check Rating</InputLabel>
        <Select
          fullWidth
          value={healthCheckRating.toString()}
          onChange={onHealthCheckRatingChange}
        >
          {Object.entries(HealthCheckRating)
            .filter(([k, _]) => !isNaN(Number(k)))
            .map(([k, v]) => (
              <MenuItem key={v} value={k}>
                {v}
              </MenuItem>
            ))}
        </Select>
      </>
    );
  };

  const HospitalSubcomponent = () => {
    return (
      <>
        <InputLabel style={{ marginTop: 20 }}>Discharge</InputLabel>
        <div style={{ marginLeft: 20 }}>
          <InputLabel style={{ marginTop: 20 }}>Date</InputLabel>
          <TextField
            type="date"
            fullWidth
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
          />
          <InputLabel style={{ marginTop: 20 }}>Criteria</InputLabel>
          <TextField
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        </div>
      </>
    );
  };

  const OccupationalHealthcareSubcomponent = () => {
    return (
      <>
        <InputLabel style={{ marginTop: 20 }}>Employer Name</InputLabel>
        <TextField
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>Sick Leave</InputLabel>
        <div style={{ marginLeft: 20 }}>
          <InputLabel style={{ marginTop: 20 }}>Start Date</InputLabel>
          <TextField
            type="date"
            fullWidth
            value={sickLeaveStartDate}
            onChange={({ target }) => setSickLeaveStartDate(target.value)}
          />
          <InputLabel style={{ marginTop: 20 }}>End Date</InputLabel>
          <TextField
            type="date"
            fullWidth
            value={sickLeaveEndDate}
            onChange={({ target }) => setSickLeaveEndDate(target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: 20 }}>Type</InputLabel>
        <Select fullWidth value={type} onChange={onTypeChange}>
          {entryTypes.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <InputLabel style={{ marginTop: 20 }}>Date</InputLabel>
        <TextField
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>Description</InputLabel>
        <TextField
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>Specialist</InputLabel>
        <TextField
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>DiagnosisCodes</InputLabel>
        <Select multiple fullWidth value={diagnosisCodes} onChange={({ target }) => setDiagnosisCodes(target.value as string[])}>
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.name}
            </MenuItem>
          ))}
        </Select>
        {((): JSX.Element => {
          switch (type) {
            case "HealthCheck":
              return HealthCheckSubcomponent();
            case "Hospital":
              return HospitalSubcomponent();
            case "OccupationalHealthcare":
              return OccupationalHealthcareSubcomponent();
            default:
              return assertNever(type);
          }
        })()}

        <Grid sx={{mt: 3, mb: 10}}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
