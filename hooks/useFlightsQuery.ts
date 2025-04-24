// src/hooks/useFlightsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { GettingFlightsapi } from "@/lib/api/GettingFlightapi";
import { ScrapeFlightParams } from "@/lib/api/Flightsapi";
import { IFlight } from "@/lib/db/models/Flights";



export type FlightResult = Omit<IFlight, keyof Document> & {
  _id?: string;
};


export const useFlightsQuery = (params: ScrapeFlightParams, enabled = true) => {
  return useQuery<FlightResult[], Error>({
    queryKey: ["flights", params],
    queryFn: async () => {
      const response = await GettingFlightsapi(
        params.from,
        params.to,
        params.departureDate,
        params.travelClass
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch flights");
      }
    },
    enabled, // you can toggle this from the component (e.g. disable until form is submitted)
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
