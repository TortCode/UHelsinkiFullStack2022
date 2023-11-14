function calculateBmi(height: number, weight: number): string {
    const bmi = weight / ((height / 100) ** 2);
    if (bmi <= 18.5) {
        return 'Underweight (bad weight)';
    } else if (bmi <= 25) {
        return 'Normal (healthy weight)';
    } else {
        return 'Overweight (bad weight)';
    }
}

console.log(calculateBmi(180, 74));