import React, { useState } from "react";
import {
  Plane,
  Heart,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { extractAirportCode } from "@/utils/extractAirportCode";
import { generateEmiratesUrl } from "@/utils/generateEmiratesUrl";
import { ScrapeFlightParams } from "@/lib/api/Flightsapi";
import { FlightDetails } from "@/lib/db/models/Flights";
interface FlightCardProps {
  flight: FlightDetails;
  from: string;
  to: string;

  departureDate: string;
  returnDate?: string;
  travelClass: string;
  travellers?: number;
}

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  from,
  to,

  departureDate,
  returnDate,
  travelClass,
  travellers = 1,
}) => {
  const [favorite, setFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Updated airline logo handling for Emirates.png and Qatar.jpg
  const getAirlineLogo = () => {
    const airlineName = flight.airline.toLowerCase();

    if (airlineName.includes("emirates")) {
      return "/Emirates.svg";
    } else if (airlineName.includes("qatar")) {
      return "/Qatar.svg";
    } else {
      // Fallback for other airlines
      const airlineSlug = airlineName.replace(/\s+/g, "-");
      return `/airlines/${airlineSlug}.svg`;
    }
  };

  // Dynamic background based on airline
  const getCardAccentColor = () => {
    if (flight.airline.toLowerCase().includes("emirates")) {
      return "from-red-50 to-amber-50 border-l-red-500";
    } else if (flight.airline.toLowerCase().includes("qatar")) {
      return "from-purple-50 to-indigo-50 border-l-purple-500";
    } else {
      return "from-blue-50 to-sky-50 border-l-blue-500";
    }
  };

  const validatedTravelClass =
    travelClass === "Economy" ||
    travelClass === "Business" ||
    travelClass === "First"
      ? travelClass
      : "Economy";

  // Generate booking URL based on airline
  const getBookingUrl = () => {
    // For Emirates airline
    if (flight.airline.toLowerCase().includes("emirates")) {
      const params: ScrapeFlightParams = {
        tripType: returnDate ? "return" : "one-way",
        from,
        to,
        departureDate,
        returnDate,
        travelClass: validatedTravelClass,
        travellers: "1",
      };

      const { url } = generateEmiratesUrl(params);
      return url;
    }
    // For Qatar Airways
    else {
      const bookingClassCode =
        validatedTravelClass === "Economy"
          ? "E"
          : validatedTravelClass === "Business"
            ? "B"
            : "F";

      const tripTypeCode = returnDate ? "R" : "O";
      const fromCode = extractAirportCode(from);
      const toCode = extractAirportCode(to);

      return `https://www.qatarairways.com/app/booking/flight-selection?widget=QR&searchType=F&addTaxToFare=Y&minPurTime=0&selLang=en&tripType=${tripTypeCode}&fromStation=${fromCode}&toStation=${toCode}&departing=${departureDate}&bookingClass=${bookingClassCode}&adults=${travellers}&children=0&infants=0&ofw=0&teenager=0${
        returnDate ? `&returning=${returnDate}` : ""
      }&flexibleDate=off`;
    }
  };

  const bookingUrl = getBookingUrl();

  return (
    <div className="w-full max-w-4xl mx-auto my-2 sm:my-4 px-2 sm:px-0">
      <div
        className={`rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
          isHovered
            ? "shadow-xl translate-y-px border border-gray-100"
            : "shadow-md border border-gray-200"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left color accent bar */}
          <div
            className={`hidden lg:block w-1 bg-gradient-to-b ${getCardAccentColor()}`}
          ></div>

          {/* Flight Info */}
          <div className="flex-grow p-3 sm:p-4 md:p-6">
            {/* Header with flight type and stops */}
            <div className="flex justify-between items-center mb-3 sm:mb-5">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 sm:p-2 rounded-lg shadow-sm">
                  <Plane size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800">
                    {returnDate ? "Round Trip" : "One Way"}
                  </div>
                  <div className="text-xs text-gray-500 hidden xs:block">
                    {from} to {to}
                  </div>
                </div>
              </div>

              <div
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                  flight.stops === "Direct"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                } text-xs font-semibold`}
              >
                {flight.stops === "Direct" ? "Nonstop" : flight.stops}
              </div>
            </div>

            {/* Main flight details */}
            <div className="flex items-center">
              {/* Airline logo */}
              <div className="hidden sm:flex flex-col items-center mr-4 sm:mr-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md p-3">
                  <img
                    src={getAirlineLogo()}
                    alt={flight.airline}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `/api/placeholder/48/48?text=${flight.airline.charAt(0)}`;
                    }}
                    className="object-cover max-w-full max-h-full"
                  />
                </div>

                <span className="text-xs font-medium text-gray-700 text-center mt-1 sm:mt-2">
                  {flight.airline}
                </span>
              </div>

              {/* Flight times and route */}
              <div className="flex-1 flex items-center justify-between">
                {/* Departure */}
                <div className="text-left">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {flight.departureTime}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 font-medium mt-0.5 sm:mt-1">
                    <MapPin
                      size={10}
                      className="mr-1 text-gray-400"
                      strokeWidth={2.5}
                    />
                    <span className="truncate max-w-24 sm:max-w-full">
                      {from}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden xs:block">
                    <Calendar
                      size={10}
                      className="inline mr-1"
                      strokeWidth={2.5}
                    />
                    {departureDate}
                  </div>
                </div>

                {/* Flight duration */}
                <div className="flex flex-col items-center mx-2 sm:mx-4">
                  <div className="flex items-center w-12 sm:w-24 md:w-32 lg:w-48">
                    <div className="h-0.5 bg-gradient-to-r from-gray-300 via-blue-500 to-gray-300 flex-grow" />
                    <div className="mx-1 text-blue-600">
                      <ArrowRight size={12} strokeWidth={2} />
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-gray-300 via-blue-500 to-gray-300 flex-grow" />
                  </div>
                  <div className="flex items-center text-xs font-medium text-blue-700 mt-1 sm:mt-2 bg-blue-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    <Clock size={10} className="mr-1" strokeWidth={2.5} />
                    <span className="text-xs">{flight.duration}</span>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-right">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {flight.arrivalTime}
                  </div>
                  <div className="flex items-center justify-end text-xs text-gray-600 font-medium mt-0.5 sm:mt-1">
                    <MapPin
                      size={10}
                      className="mr-1 text-gray-400"
                      strokeWidth={2.5}
                    />
                    <span className="truncate max-w-24 sm:max-w-full">
                      {to}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden xs:block">
                    {returnDate && (
                      <>
                        <Calendar
                          size={10}
                          className="inline mr-1"
                          strokeWidth={2.5}
                        />
                        {returnDate}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional flight details */}
            <div className="mt-3 sm:mt-5 pt-2 sm:pt-4 border-t border-gray-100 flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-500">
              <div className="inline-flex items-center bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <Users size={10} className="mr-1" strokeWidth={2.5} />
                <span>
                  {travellers} {travellers === 1 ? "Passenger" : "Passengers"}
                </span>
              </div>
              <div className="inline-flex items-center bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <span className="font-medium">{validatedTravelClass}</span>
              </div>
              <div className="inline-flex items-center bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full sm:hidden">
                <span className="font-medium">{flight.airline}</span>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:w-64 xl:w-72 flex flex-col bg-gradient-to-br from-gray-50 to-white border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="p-3 sm:p-4 md:p-6 flex flex-col h-full">
              <div className="flex justify-between mb-3 sm:mb-6">
                <div className="flex items-baseline lg:hidden">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {flight.price}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/person</span>
                </div>
                <button
                  onClick={() => setFavorite(!favorite)}
                  className={`p-1.5 sm:p-2 rounded-full ${favorite ? "bg-red-50" : "bg-gray-50 hover:bg-red-50"} transition-colors duration-300 ml-auto`}
                >
                  <Heart
                    size={18}
                    className={
                      favorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }
                    strokeWidth={2}
                  />
                </button>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="hidden lg:block mb-1 text-sm text-gray-500 font-medium">
                  Total fare
                </div>
                <div className="hidden lg:flex items-baseline">
                  <span className="text-2xl xl:text-3xl font-bold text-gray-900">
                    {flight.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/person</span>
                </div>

                <div className="w-full mt-0 lg:mt-6">
                  <button
                    className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 
                    ${isHovered ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-blue-500 shadow-md shadow-blue-100"} 
                    text-white hover:bg-blue-700`}
                  >
                    <span>Select Flight</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>

                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center mt-2 sm:mt-3 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View on {flight.airline}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
