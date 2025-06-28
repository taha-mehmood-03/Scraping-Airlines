import axios from "axios";
import parseFlightData from "@/utils/parseFlightData";
import { StoringFlightapi } from "./StoringFlightapi";


export interface Flights {
  _id?: string; 
  airline: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  stops: string;
  duration: string;
  price: string;
}
export interface ScrapeFlightParams {
  tripType: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travelClass: string;
  travellers: string;
}

interface ScrapeFlightsResponse {
  qatar: any[];     // Or a more specific type like QatarFlight[]
  emirates: any[];  // Or EmiratesFlight[]
}



export const fetchFlights = async (
  params: ScrapeFlightParams
): Promise<{ qatar: Flights[]; emirates: Flights[] }> => {
  try {
    // Using fetch instead of axios for Next.js optimization
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
    const response = await fetch(`/api/scrape-flights?${queryString}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const { qatar: qatarRawFlights, emirates: emiratesFlights } = 
      await response.json() as ScrapeFlightsResponse;

    // Process Qatar flights
    const formattedQatarFlights = qatarRawFlights
      .map(parseFlightData)
      .filter((flight): flight is Flights => flight !== null);

    // Process Emirates flights (assuming they don't need parsing)
    const formattedEmiratesFlights = emiratesFlights
      .filter(flight => flight !== null);

    // Store flights in parallel
    await Promise.all([
      formattedQatarFlights.length > 0 && StoringFlightapi(params, formattedQatarFlights),
      formattedEmiratesFlights.length > 0 && StoringFlightapi(params, formattedEmiratesFlights)
    ]);

    console.log('Successfully stored flights:', {
      qatar: formattedQatarFlights.length,
      emirates: formattedEmiratesFlights.length
    });

    return {
      qatar: formattedQatarFlights,
      emirates: formattedEmiratesFlights
    };

  } catch (error) {
    console.error('Error in fetchFlights:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch and process flights'
    );
  }
};