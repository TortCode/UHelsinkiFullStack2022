import express from 'express';
import { parseNumber } from './utils';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  if (req.query.height === undefined || req.query.weight === undefined) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  try {
    const height = parseNumber(req.query.height as string);
    const weight = parseNumber(req.query.weight as string);
    const bmi = calculateBmi(height, weight);
    res.status(200).json({
      weight,
      height,
      bmi
    });
  } catch (e: unknown) {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(daily_exercises) || typeof target !== 'number' || daily_exercises.some(d => typeof d !== 'number')) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }
  
  try {
    const result = calculateExercises(daily_exercises as number[], target);
    res.status(200).json(result);
  } catch (e: unknown) {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});