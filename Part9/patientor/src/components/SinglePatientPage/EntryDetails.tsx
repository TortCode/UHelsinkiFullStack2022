import { Divider, List, ListItem, Typography } from "@mui/material";
import { useContext } from "react";
import DiagnosisContext from "../../DiagnosisContext";
import {
  LocalHospitalOutlined as HospitalIcon,
  MonitorHeartOutlined as HealthCheckIcon,
  WorkOutlineOutlined as OccupationalHealthcareIcon,
} from "@mui/icons-material";
import { BaseEntry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, Entry, assertNever } from "../../types";
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
      <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
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

export default EntryDetails;