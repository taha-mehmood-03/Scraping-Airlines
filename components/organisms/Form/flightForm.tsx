import React from "react";
import Button from "@/components/atoms/Button/Button";
import { Card, CardHeader, CardBody } from "@heroui/react";
import FlightDetail from "@/components/molecules/FlightDetail/FlightDetail";
import { useFlightForm } from "@/hooks/useFlightForm";

interface FlightFormProps {
  setIsScraping: (value: boolean) => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ setIsScraping }) => {
  const { handleSubmit, ...flightForm } = useFlightForm(setIsScraping);

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-5xl mx-auto my-6 sm:my-8 rounded-xl shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 sm:p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Find Flight Tickets</h1>
        </CardHeader>

        <CardBody>
          <FlightDetail {...flightForm} />
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Button
              type="submit"
              className="w-full sm:w-2/3 lg:w-1/2 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow transition-all hover:shadow-md"
            >
              Search Flights
            </Button>
          </div>
          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            No booking fees • Free cancellation on select flights • Best price guarantee
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default FlightForm;
