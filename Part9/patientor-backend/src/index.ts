import express from 'express';
import cors from 'cors';

import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';
import { handleError } from './utils';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/ping', (_request, response) => {
    console.log("PING");
    response.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

app.use(handleError);

const PORT = 3001;

app.listen(PORT,() => {
    console.log('Listening to port', PORT);
});