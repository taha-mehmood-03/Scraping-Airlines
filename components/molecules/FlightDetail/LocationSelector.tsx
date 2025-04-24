import React from "react";
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import { ArrowLeftRight } from "lucide-react";

interface LocationSelectorProps {
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  onSwap?: () => void;
  fromTouched?: boolean;
  toTouched?: boolean;
  setFromTouched?: (value: boolean) => void;
  setToTouched?: (value: boolean) => void;
  setFormValid?: (value: boolean) => void;
}

const airportOptions = [
  { id: "jfk", label: "New York (JFK)" },
  { id: "lax", label: "Los Angeles (LAX)" },
  { id: "ord", label: "Chicago (ORD)" },
  { id: "lhr", label: "LONDON (LON)" },
  { id: "dxb", label: "Dubai (DXB)" },
  { id: "hnd", label: "Tokyo (HND)" },
];

const LocationSelector: React.FC<LocationSelectorProps> = ({
  from,
  setFrom,
  to,
  setTo,
  onSwap,
  fromTouched = false,
  toTouched = false,
  setFromTouched = () => {},
  setToTouched = () => {},
  setFormValid = () => {},
}) => {
  // Local validity state for visual feedback
  const [locationValid, setLocationValid] = React.useState(false);

  // Direct input handlers
  const handleFromInput = (value: string) => {
    console.log("From direct input:", value);
    setFrom(value);
    setFromTouched(true);
  };

  const handleToInput = (value: string) => {
    console.log("To direct input:", value);
    setTo(value);
    setToTouched(true);
  };

  // Handle autocomplete selection
  const handleFromSelection = (value: any) => {
    console.log("From selection:", value);
    setFrom(typeof value === "string" ? value : value?.label || "");
    setFromTouched(true);
  };

  const handleToSelection = (value: any) => {
    console.log("To selection:", value);
    setTo(typeof value === "string" ? value : value?.label || "");
    setToTouched(true);
  };

  // Validate whenever form values change
  React.useEffect(() => {
    console.log("LocationSelector values updated:", { from, to });
    const isValid = from !== "" && to !== "" && from !== to;
    console.log("Location validity:", isValid);
    setLocationValid(isValid);
    setFormValid(isValid);
  }, [from, to, setFormValid]);

  return (
    <>
      {/* From Field */}
      <div className="sm:col-span-1 lg:col-span-3">
        <label className="block mb-1 text-sm font-medium">From</label>
        <select
          value={from}
          onChange={(e) => handleFromInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="">Select origin</option>
          {airportOptions.map((airport) => (
            <option key={airport.id} value={airport.label}>
              {airport.label}
            </option>
          ))}
        </select>
        {fromTouched && !from && (
          <p className="text-red-500 text-xs mt-1">Please select origin</p>
        )}
      </div>

      {/* Swap Button */}
      {onSwap && (
        <div className="hidden sm:flex lg:col-span-1 items-end justify-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              console.log("Swapping locations:", { from, to });
              onSwap();
              setFromTouched(true);
              setToTouched(true);
            }}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* To Field */}
      <div className="sm:col-span-1 lg:col-span-3">
        <label className="block mb-1 text-sm font-medium">To</label>
        <select
          value={to}
          onChange={(e) => handleToInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="">Select destination</option>
          {airportOptions.map((airport) => (
            <option key={airport.id} value={airport.label}>
              {airport.label}
            </option>
          ))}
        </select>
        {toTouched && !to && (
          <p className="text-red-500 text-xs mt-1">Please select destination</p>
        )}
        {fromTouched && toTouched && from && to && from === to && (
          <p className="text-red-500 text-xs mt-1">
            Origin and destination cannot be the same
          </p>
        )}
      </div>

      {/* Mobile Swap Button */}
      {onSwap && (
        <div className="sm:hidden flex justify-center mt-1 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              console.log("Swapping locations (mobile):", { from, to });
              onSwap();
              setFromTouched(true);
              setToTouched(true);
            }}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <ArrowLeftRight className="h-5 w-5 mr-2" />
            <span>Swap</span>
          </Button>
        </div>
      )}
    </>
  );
};

export default LocationSelector;
