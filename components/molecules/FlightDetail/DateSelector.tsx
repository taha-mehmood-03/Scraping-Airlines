import React from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar
} from "@heroui/react";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseDate, getLocalTimeZone, CalendarDate } from "@internationalized/date";

interface DateSelectorProps {
  tripType: "oneWay" | "roundTrip";
  departureDate: Date | null;
  setDepartureDate: (date: Date | null) => void;
  returnDate: Date | null;
  setReturnDate: (date: Date | null) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  tripType,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate
}) => {

  // Reusable DatePicker Component
  const DatePicker = ({
    label,
    selectedDate,
    setDate,
    disabled = false,
    minDate
  }: {
    label: string;
    selectedDate: Date | null;
    setDate: (date: Date | null) => void;
    disabled?: boolean;
    minDate?: Date | null;
  }) => (
    <div className={`sm:col-span-1 lg:col-span-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="bordered"
            className="w-full flex justify-between items-center"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })
                : "Select date"}
            </span>
            <CalendarIcon className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 border-0 shadow-lg rounded-lg">
          <Calendar
            value={selectedDate ? parseDate(selectedDate.toISOString().split("T")[0]) : undefined}
            onChange={(value) => {
              if (value) {
                const newDate = value.toDate(getLocalTimeZone());
                setDate(newDate);
              } else {
                setDate(null);
              }
            }}
            className="rounded-lg border-0"
            isDisabled={disabled}
            isDateUnavailable={(date) => {
              const localDate = date.toDate(getLocalTimeZone());
              return (minDate && localDate < minDate) || localDate < new Date();
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <>
      {/* Departure Date */}
      <DatePicker
        label="Departure"
        selectedDate={departureDate}
        setDate={(date) => {
          setDepartureDate(date);
          if (returnDate && date && returnDate < date) {
            setReturnDate(null);
          }
        }}
      />

      {/* Return Date (Only for Round Trip) */}
      <DatePicker
        label="Return"
        selectedDate={returnDate}
        setDate={setReturnDate}
        disabled={tripType !== "roundTrip"}
        minDate={departureDate}
      />
    </>
  );
};

export default DateSelector;
