import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;
     
    if (isNaN(Number(height)) || isNaN(Number(weight))) {
        res.status(400).json({ error: 'malformatted parameters' });
    } else {
        const bmi = calculateBmi(Number(height), Number(weight));
        res.json({ weight, height, bmi });
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;
    if (!daily_exercises || !target) {
        res.status(400).json({ error: 'parameters missing' });
    } else if (isNaN(Number(target)) || daily_exercises.some((hours: Number) => isNaN(Number(hours)))) {
        res.status(400).json({ error: 'malformatted parameters' });
    } else {
        const result = exerciseCalculator(daily_exercises as number[], Number(target));
        res.json(result);
    }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});