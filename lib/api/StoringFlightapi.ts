import axios from "axios";
import { Flights } from "./Flightsapi";

interface ScrapeFlightParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travelClass: string;
}

export const StoringFlightapi = async (
  params: {
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    travelClass: string;
  },
  flights: any[]
): Promise<void> => {
  try {
    console.log("Formatted Flights to Store:", flights);

    const response = await fetch('/api/flights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        flights,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Stored Flights Response:", data);
    return data;

  } catch (error) {
    console.error("Error storing data", error);
    throw error;
  }
};