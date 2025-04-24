import { ScrapeFlightParams } from "@/lib/api/Flightsapi";
import { extractAirportCode } from "./extractAirportCode";

export const generateEmiratesUrl = (params: ScrapeFlightParams): { url: string; fromCode: string; toCode: string } => {
  const {
    tripType = "one-way",
    from,
    to,
    departureDate,
    returnDate = "",
    travelClass = "Economy",
    travellers = 1,
  } = params;
  
  const fromCode = extractAirportCode(from);
  const toCode = extractAirportCode(to);
  
  if (!fromCode || !toCode || !departureDate) {
    throw new Error("Missing or invalid parameters");
  }
  
  const cabinClassMap: Record<string, string> = {
    Economy: "Y",
    Business: "J",
    First: "F",
  };
  const cabinClass = cabinClassMap[travelClass] || "Y";
  
  const journeyTypeMap: Record<string, string> = {
    "one-way": "ONEWAY",
    return: "RETURN",
    "multi-city": "MULTICITY",
  };
  const journeyType = journeyTypeMap[tripType.toLowerCase()] || "ONEWAY";
  
  const passengerCount = typeof travellers === "number"
    ? travellers
    : parseInt(travellers as string) || 1;
  
  const searchRequest = {
    journeyType,
    bookingType: "REVENUE",
    passengers: [{ type: "ADT", count: passengerCount }],
    segments: [
      {
        departure: fromCode,
        arrival: toCode,
        travelDate: departureDate,
        cabinClass,
      },
    ],
    referrer: "/book",
    source: "search-form",
  };
  
  if (journeyType === "RETURN" && returnDate) {
    searchRequest.segments.push({
      departure: toCode,
      arrival: fromCode,
      travelDate: returnDate,
      cabinClass,
    });
  }
  
  const encoded = Buffer.from(JSON.stringify(searchRequest)).toString("base64");
  const url = `https://www.emirates.com/booking/search-results/?searchRequest=${encoded}`;
  
  return { url, fromCode, toCode };
};