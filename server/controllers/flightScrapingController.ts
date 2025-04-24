// flightController.ts
import { Request, Response } from "express";
import { scrapeFlightData } from "../scraper/flightScraper";
import { scrapeFlightDataEmirates } from "../scraper/flightScraperEmirates";

export const scrapeFlights = async (req: Request, res: Response) => {
  try {
    console.log("Received request with query params:", req.query);
    
    const { tripType, from, to, departureDate, returnDate, travelClass, travellers } = req.query;

    const baseParams = {
      tripType: tripType as string,
      from: from as string,
      to: to as string,
      departureDate: departureDate as string,
      returnDate: returnDate as string || "",
      travelClass: travelClass as string,
      travellers: travellers as string,
    };

    // Scrape Qatar flights
    const qatarFlights = await scrapeFlightData(baseParams);

    // Scrape Emirates flights
    const emiratesFlights = await scrapeFlightDataEmirates(baseParams);

    // Log results
    console.log("Scraped Qatar flights:", qatarFlights);
    console.log("Scraped Emirates flights:", emiratesFlights);

    // Return both
    res.json({
      qatar: qatarFlights,
      emirates: emiratesFlights
    });

  } catch (error) {
    console.error("Error scraping flights:", error);
    res.status(500).json({ error: "Failed to scrape flight details" });
  }
};
