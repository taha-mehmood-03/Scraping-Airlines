// app/api/scrape-flights/route.ts
import { NextResponse } from 'next/server';
import { scrapeFlightData } from '../../../server/scraper/flightScraper';
import { scrapeFlightDataEmirates } from '../../../server/scraper/flightScraperEmirates';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    console.log("Received request with query params:", Object.fromEntries(searchParams));

    const baseParams = {
      tripType: searchParams.get('tripType') || '',
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      departureDate: searchParams.get('departureDate') || '',
      returnDate: searchParams.get('returnDate') || '',
      travelClass: searchParams.get('travelClass') || '',
      travellers: searchParams.get('travellers') || ''
    };

    // Scrape both airlines in parallel
    const [qatarFlights, emiratesFlights] = await Promise.all([
      scrapeFlightData(baseParams),
      scrapeFlightDataEmirates(baseParams)
    ]);

    console.log("Scraped Qatar flights:", qatarFlights);
    console.log("Scraped Emirates flights:", emiratesFlights);

    return NextResponse.json({
      qatar: qatarFlights,
      emirates: emiratesFlights
    });

  } catch (error) {
    console.error("Error scraping flights:", error);
    return NextResponse.json(
      { error: "Failed to scrape flight details" },
      { status: 500 }
    );
  }
}