import { parseNumber } from "./utils";

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);
  if (bmi <= 18.5) {
    return 'Underweight (bad weight)';
  } else if (bmi <= 25) {
    return 'Normal (healthy weight)';
  } else {
    return 'Overweight (bad weight)';
  }
};

interface BmiArguments {
  height: number;
  weight: number;
}

const parseArgs = (args: string[]): BmiArguments => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  const height = parseNumber(args[2]);
  const weight = parseNumber(args[3]);

  return {
    height,
    weight
  };
};

if (require.main === module) {
  try {
    const { height, weight } = parseArgs(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log('Error:', e.message);
    }
  }
}
