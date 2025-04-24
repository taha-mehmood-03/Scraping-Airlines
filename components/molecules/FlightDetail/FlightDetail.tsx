import React, { useEffect } from "react";
import LocationSelector from "./LocationSelector";
import DateSelector from "./DateSelector";
import TravellerSelector from "./TravellerSelector";
import TripTypeSelector from "@/components/atoms/Button/TripTypeSelector";

interface FlightDetailProps {
  tripType: "oneWay" | "roundTrip";
  setTripType: (type: "oneWay" | "roundTrip") => void;
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  departureDate: Date | null;
  setDepartureDate: (date: Date | null) => void;
  returnDate: Date | null;
  setReturnDate: (date: Date | null) => void;
  travelClass: string;
  setTravelClass: (className: string) => void;
  travellers: number;
  setTravellers: (count: number) => void;
}

const FlightDetail: React.FC<FlightDetailProps> = ({
  tripType,
  setTripType,
  from,
  setFrom,
  to,
  setTo,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  travelClass,
  setTravelClass,
  travellers,
  setTravellers
}) => {

  useEffect(() => {
    if (tripType === "oneWay") {
      setReturnDate(null); // Reset return date when switching to one-way
    }
  }, [tripType, setReturnDate]);

  return (
    <div className="space-y-4">
      <TripTypeSelector tripType={tripType} setTripType={setTripType} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
        <LocationSelector 
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
        />
        
        <DateSelector 
          tripType={tripType}
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
        />
        
        <TravellerSelector 
          travellers={travellers}
          setTravellers={setTravellers}
          travelClass={travelClass}
          setTravelClass={setTravelClass}
        />
      </div>
    </div>
  );
};

export default FlightDetail;
