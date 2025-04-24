// utils/scraperUtils.ts
export const processFlights = (flights: string[]): string[] => {
    const pattern = /(?:Lowest fare\s*)?(\d{2}:\d{2})\s+ISB\s+(\d+ Stop),\s+([\dh\s]+m)\s+(\d{2}:\d{2}\+?\d?)DXB.*?(PKR [\d,]+)/;
    
    return flights.map(flight => {
        const matches = flight.replace(/\s+/g, ' ').trim().match(pattern);
        if (matches) {
            const [_, departure, stops, duration, arrival, price] = matches;
            return `${departure} from ISB to DXB at ${arrival} with ${stops} and duration ${duration} (${price})`;
        }
        
        return `Unrecognized format: ${flight}`;
    });
};