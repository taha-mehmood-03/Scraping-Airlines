"use client";
import { useState } from "react";
import FlightForm from "@/components/organisms/Form/flightForm";
import ScrapingAnimation from "../components/organisms/ScrapingAnimation/scrapingAnimation"
export default function Home() {
  const [isScraping, setIsScraping] = useState(false);

  return (
    <div>
      {isScraping ? (
        <ScrapingAnimation isLoading={isScraping}/>
      ) : (
        <FlightForm setIsScraping={setIsScraping} />
      )}
    </div>
  );
}
