import React from "react";
import { Button, Popover, PopoverTrigger, PopoverContent, Autocomplete, AutocompleteItem, Slider } from "@heroui/react";
import { Users } from "lucide-react";

interface TravellerSelectorProps {
  travellers: number;
  setTravellers: (count: number) => void;
  travelClass: string;
  setTravelClass: (className: string) => void;
}

const classOptions = [
  { id: "economy", label: "Economy" },
  { id: "business", label: "Business" },
  { id: "first", label: "First Class" },
];

const TravellerSelector: React.FC<TravellerSelectorProps> = ({
  travellers,
  setTravellers,
  travelClass,
  setTravelClass
}) => {
  return (
    <div className="sm:col-span-1 lg:col-span-2">
      <label className="block mb-1 text-sm font-medium">Passengers</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
             variant="bordered"
             className="w-full flex justify-between items-center"
           >
            <span className="truncate">{travellers} Traveller{travellers > 1 ? 's' : ''} • {travelClass}</span>
            <Users className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-64 sm:w-80 shadow-lg rounded-lg border-0">
          <h3 className="font-semibold text-base mb-3">Travel Options</h3>
                    
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Class</label>
            <Autocomplete
               value={travelClass}
               onSelectionChange={(value) => setTravelClass(value as string)}
               placeholder="Select Class"
            >
              {classOptions.map((cls) => (
                <AutocompleteItem
                   key={cls.id}
                   textValue={cls.label}
                   className="py-2 px-3 text-sm sm:text-base hover:bg-blue-50"
                >
                  {cls.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
                    
          {/* Passengers Slider */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Number of Travellers</h4>
              <span className="font-medium text-blue-600 text-sm">{travellers}</span>
            </div>
                        
            <Slider
              classNames={{
                base: "max-w-full",
                filler: "bg-gradient-to-r from-blue-500 to-blue-600",
                labelWrapper: "mb-2",
                label: "font-medium text-sm",
                thumb: [
                  "transition-all",
                  "bg-gradient-to-r from-blue-600 to-blue-500",
                  "data-[dragging=true]:shadow-md",
                  "data-[dragging=true]:scale-110",
                ],
                step: "data-[in-range=true]:bg-black/30",
              }}
              value={travellers}
              onChange={(value) => setTravellers(Number(value))}
              maxValue={10}
              minValue={1}
              defaultValue={1}
              showOutline={true}
              showSteps={true}
              step={1}
            />
                        
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TravellerSelector;