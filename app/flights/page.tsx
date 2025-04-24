"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FlightCard from "@/components/organisms/FlightCard/FlightCard";
import { useFlightsQuery } from "@/hooks/useFlightsQuery";
import { Plane, AlertCircle, Loader } from "lucide-react";

export default function FlightsPage() {
  const searchParams = useSearchParams();
  
  // Extract query parameters
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const travelClass = searchParams.get("travelClass") || "Economy";
  
  // Use React Query hook instead of Redux
  const { 
    data: flightResults = [], 
    isLoading: loading, 
    error 
  } = useFlightsQuery({
    from,
    to,
    departureDate,
    travelClass,
    tripType: "oneWay", // Default value, adjust if you pass this in URL params
    travellers: "1", // Default value, adjust if you pass this in URL params
  });
  
  
  // Console log the flights data
  console.log("Flight Resultsaada:", flightResults);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center mb-3">
          <Plane className="mr-3 text-blue-600" size={28} />
          Available Flights
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the best flight option for your journey
        </p>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-lg font-medium">Loading flights...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md my-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-red-700">Error loading flights</h3>
          </div>
          <p className="mt-2 text-red-600">{(error as Error).message}</p>
        </div>
      )}
      
      {/* Results Section */}
      {!loading && !error && flightResults.length > 0 ? (
        <div className="space-y-8">
          {flightResults.map((flightResult, resultIndex) => (
            <div key={`result-${resultIndex}`} className="mb-10">
              {/* Flight Cards */}
              <div className="space-y-4">
                {flightResult.flights.map((flight, index) => (
                  <FlightCard
                    key={`flight-${resultIndex}-${index}`}
                    flight={flight}
                    from={flightResult.from}
                    to={flightResult.to}
                    departureDate={flightResult.departureDate}
                    returnDate={flightResult.returnDate}
                    travelClass={flightResult.travelClass}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg">
            <img
              src="/api/placeholder/120/120?text=✈️"
              alt="No flights"
              className="mb-4 opacity-40"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No flights available</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search criteria or check back later for new flight options.
            </p>
          </div>
        )
      )}
    </div>
  );
}