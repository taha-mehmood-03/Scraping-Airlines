import React from "react";
import Button from "./Button";
interface TripTypeSelectorProps {
  tripType: "oneWay" | "roundTrip";
  setTripType: (type: "oneWay" | "roundTrip") => void;
}

const TripTypeSelector: React.FC<TripTypeSelectorProps> = ({ tripType, setTripType }) => {
  return (
    <div className="flex gap-3 justify-center mt-4">
      <Button
        onClick={() => setTripType("oneWay")}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
          tripType === "oneWay" 
            ? "bg-blue-500 text-white hover:bg-blue-600" 
            : "bg-gray-700 text-gray-200 border border-blue-400 hover:bg-gray-600"
        }`}
      >
        One Way
      </Button>
      
      <Button
        onClick={() => setTripType("roundTrip")}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
          tripType === "roundTrip" 
            ? "bg-blue-500 text-white hover:bg-blue-600" 
            : "bg-gray-700 text-gray-200 border border-blue-400 hover:bg-gray-600"
        }`}
      >
        Round Trip
      </Button>
    </div>
  );
};

export default TripTypeSelector;
