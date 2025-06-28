import { FlightResult } from "@/hooks/useFlightsQuery";

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
): Promise<FlightApiResponse> => {
  try {
    const query = new URLSearchParams({
      from,
      to,
      departureDate,
      travelClass
    }).toString();

    const response = await fetch(`/api/flights?${query}`);
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Got the Flights Response:", data);
    return data;

  } catch (error) {
    console.error("Error getting data", error);
    throw error;
  }
};