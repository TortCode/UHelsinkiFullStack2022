import { parseNumber } from "./utils";

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (hours: number[], target: number): ExerciseResult => {
  const periodLength = hours.length;
  const trainingDays = hours.filter(h => h > 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : (average >= target * 0.8 ? 2 : 1);
  const ratingDescription = rating === 1 ? "very bad, work needed" : (rating === 2 ? "not too bad, but could be better" : "very good, keep it up");

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

interface ExerciseArguments {
  target: number;
  hours: number[];
}

const parseArgs = (args: string[]): ExerciseArguments => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = parseNumber(args[2]);

  args = args.slice(3);
  const hours = args.map(parseNumber);

  return {
    target,
    hours,
  };
};

// only run if script
if (require.main === module) {
  try {
    const { target, hours } = parseArgs(process.argv);
    console.log(calculateExercises(hours, target));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log('Error:', e.message);
    }
  }
}