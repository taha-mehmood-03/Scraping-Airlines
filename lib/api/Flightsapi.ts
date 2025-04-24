import axios from "axios";
import parseFlightData from "@/utils/parseFlightData";
import { StoringFlightsapi } from "./StoringFlightapi";


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

export const fetchFlights = async (params: ScrapeFlightParams): Promise<void> => {
  try {
    // ✅ Single request now
    const response = await axios.get<ScrapeFlightsResponse>("http://localhost:5000/api/scraping/scrape-flights", { params });

    const qatarRawFlights = response.data.qatar || [];
    const emiratesFlights = response.data.emirates || [];

    // ✅ Parse and format Qatar flights
    const formattedQatarFlights: Flights[] = qatarRawFlights
      .map(parseFlightData)
      .filter((flight): flight is Flights => flight !== null);

    if (formattedQatarFlights.length > 0) {
      console.log("formattedQatarFlights",formattedQatarFlights)
      await StoringFlightsapi(params, formattedQatarFlights); // Store Qatar
    } else {
      console.log("No valid Qatar flight data to store.");
    }

    // ✅ Format Emirates flights
    console.log("emiratesFlights",emiratesFlights)

  
    if (emiratesFlights.length > 0) {
      await StoringFlightsapi(params, emiratesFlights);
      console.log("emiratesFlights",emiratesFlights) // Store Emirates
    } else {
      console.log("No valid Emirates flight data to store.");
      console.log("emiratesFlights",emiratesFlights)
    }

    // // ✅ Always fetch from DB after storing
    // dispatch(fetchdbFlights(params));

  } catch (error) {
    console.error("Error fetching scraped data", error);
    throw error;
  }
};
