import { createContext } from 'react';
import { Patient } from './types';

const PatientsContext = createContext<[Patient[], React.Dispatch<React.SetStateAction<Patient[]>>] | null>(null);

export default PatientsContext;