import axios from "axios";
import { FlightResult } from "@/hooks/useFlightsQuery";
// Define the API response structure
interface FlightApiResponse {
  success: boolean;
  data: FlightResult[];
  message?: string;
}

export const GettingFlightsapi = async (
  from: string,
  to: string,
  departureDate: string,
  travelClass: string
): Promise<FlightApiResponse>=> {  // Return the whole response structure
  try {
    const response = await axios.get<FlightApiResponse>("http://localhost:5000/api/flights", {
      params: {
        from,
        to,
        departureDate,
        travelClass,
      },
    });
    
    console.log("Got the Flights Response:", response.data);
    
    return response.data;  // Return the whole response object
  } catch (error) {
    console.error("Error getting data", error);
    throw error;
  }
}