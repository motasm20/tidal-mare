import { EindhovenProvider } from './providers/EindhovenProvider';

const debug = async () => {
    console.log('Starting debug...');
    const provider = new EindhovenProvider();
    try {
        const cars = await provider.getAvailableCars({
            startLocation: { address: 'Debug' },
            endLocation: { address: 'Debug' },
            passengers: 1,
            luggageLevel: 0,
            dateTime: new Date().toISOString()
        });
        console.log(`Successfully fetched ${cars.length} cars from Eindhoven API.`);
        if (cars.length > 0) {
            console.log('First car sample:', JSON.stringify(cars[0], null, 2));
        }
    } catch (err) {
        console.error('Debug failed:', err);
    }
};

debug();
