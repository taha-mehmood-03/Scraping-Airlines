import { useState, useCallback } from "react";
import { fetchFlights } from "@/lib/api/Flightsapi";
import { useRouter } from "next/navigation";

export const useFlightForm = (setIsScraping?: (value: boolean) => void) => {
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [travelClass, setTravelClass] = useState("Economy");
  const [travellers, setTravellers] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsScraping?.(true); // 🔥 trigger animation

      try {
        const params = {
          tripType,
          from,
          to,
          departureDate: departureDate?.toISOString().split("T")[0] || "",
          returnDate:
            tripType === "roundTrip" && returnDate
              ? returnDate.toISOString().split("T")[0]
              : "",
          travelClass,
          travellers: travellers.toString(),
        };

        await fetchFlights(params);

        // optional delay for smoother UX
        setTimeout(() => {
          router.push(
            `/flights?from=${from}&to=${to}&departureDate=${params.departureDate}&travelClass=${travelClass}`
          );
        }, 500);
      } catch (err) {
        setIsScraping?.(false); // stop animation if error
        setError("Failed to fetch flights. Please try again.");
        console.error("Error fetching flights:", err);
      }
    },
    [
      tripType,
      from,
      to,
      departureDate,
      returnDate,
      travelClass,
      travellers,
      router,
      setIsScraping,
    ]
  );

  return {
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
    setTravellers,
    handleSubmit,
    error,
  };
};
