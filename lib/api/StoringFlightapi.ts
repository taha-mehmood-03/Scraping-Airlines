import axios from "axios";
import { Flights } from "@/store/reducers/flightsSlice";
interface ScrapeFlightParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travelClass: string;
}

export const StoringFlightsapi = async (params: ScrapeFlightParams, formattedFlights: Flights[]): Promise<void> => {
  try {
    console.log("Formatted Flights to Store:", formattedFlights);

    const storeResponse = await axios.post("http://localhost:5000/api/flights/storing", {
      ...params,
      flights: formattedFlights,
    });

    console.log("Stored Flights Response:", storeResponse.data);
  } catch (error) {
    console.error("Error storing data", error);
    throw error;
  }
};
