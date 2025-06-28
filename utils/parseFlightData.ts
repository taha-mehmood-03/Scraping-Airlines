import { Flights } from "@/lib/api/Flightsapi";

const parseFlightData = (rawData: string): Flights | null => {
  console.log("Attempting to parse:", rawData);
  
  // Enhanced regex to handle next-day arrivals (+1), various spacing patterns, and currency symbols
  const match = rawData.match(
    /([A-Za-z\s]+?)?\s*(\d{1,2}:\d{2})\s+([A-Z]{3})\s+(.*?)(?:,|\s)\s*([\dh\s]+m)\s+(\d{1,2}:\d{2})(\+\d+)?([A-Z]{3}).*?([£$€¥₹])([\d,]*)/
  );
  
  if (!match) {
    console.warn("Failed to parse flight data:", rawData);
    // For debugging
    if (/[£$€¥₹]/.test(rawData)) {
      console.log("Contains price symbol:", rawData.match(/[£$€¥₹]/)?.[0]);
    }
    if (/\d{1,2}:\d{2}/.test(rawData)) {
      console.log("Contains time formats");
    }
    if (/[A-Z]{3}/.test(rawData)) {
      console.log("Contains airport codes");
    }
    
    // Try an alternative pattern as fallback
    const altMatch = rawData.match(
      /([A-Za-z\s]+?)?\s*(\d{1,2}:\d{2})\s+([A-Z]{3})\s+(.*?)(?:,|\s)\s*([\dh\s]+m)\s+(\d{1,2}:\d{2})(\+\d+)?([A-Z]{3}).*?Flight details([£$€¥₹])([\d,]*)/
    );
    
    if (!altMatch) {
      return null;
    }
    
    // Construct arrival time with the "+1" if present
    const arrivalTime = altMatch[7] ? `${altMatch[6]}${altMatch[7]}` : altMatch[6];
    
    // Include additional/premium info in airline name if present
    const airlinePrefix = altMatch[1] ? altMatch[1].trim() : "";
    const airlineName = airlinePrefix ? `Qatar Airways (${airlinePrefix})` : "Qatar Airways";
    
    return {
      airline: airlineName,
      departureTime: altMatch[2],
      departureAirport: altMatch[3],
      stops: altMatch[4].trim(),
      duration: altMatch[5],
      arrivalTime: arrivalTime,
      arrivalAirport: altMatch[8],
      price: `${altMatch[9]}${altMatch[10]}`, // Currency symbol + price
    };
  }
  
  console.log("Match groups:", match);
  
  // Construct arrival time with the "+1" if present
  const arrivalTime = match[7] ? `${match[6]}${match[7]}` : match[6];
  
  // Include additional/premium info in airline name if present
  const airlinePrefix = match[1] ? match[1].trim() : "";
  const airlineName = airlinePrefix ? `Qatar Airways (${airlinePrefix})` : "Qatar Airways";
  
  return {
    airline: airlineName,
    departureTime: match[2],
    departureAirport: match[3],
    stops: match[4].trim(),
    duration: match[5],
    arrivalTime: arrivalTime,
    arrivalAirport: match[8],
    price: `${match[9]}${match[10]}`, // Currency symbol + price
  };
};

export default parseFlightData;