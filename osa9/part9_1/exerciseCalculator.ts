interface Results {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
    }

interface exerciseValues {
    target: number,
    hours: number[]
}

const parseHours = (args: string[]): exerciseValues => {
    if (args.length < 4) throw new Error('Not enough arguments');

    const inputs = args.slice(2);
    if (inputs.some(hours => isNaN(Number(hours)))) throw new Error('Provided values were not numbers!');
    const target = Number(inputs[0]);
    const dailyHours = inputs.slice(1).map(hours => Number(hours));
    return {
        target,
        hours: dailyHours
    };
    
};

export const exerciseCalculator = (dailyHours: number[], target: number): Results => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(hours => hours > 0).length;
    const average = dailyHours.reduce((a, b) => a + b) / periodLength;
    const success = average >= target;
    const rating = average < target ? 1 : average === target ? 2 : 3;
    const ratingDescription = rating === 1 ? "didnt reach target :(" : rating === 2 ? " target reached" : "target exceeded!";

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

try {
    const { target, hours } = parseHours(process.argv);
    console.log(exerciseCalculator(hours, target));
} catch (error: unknown) {
    if (error instanceof Error) {
        console.log('Error, something bad happened: ', error.message);
    } else {
        throw error;
    }
}