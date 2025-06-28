// flightScraper.ts
import puppeteer from "puppeteer";
import { processFlights } from "../../utils/scraperUtils";
import { extractAirportCode } from "../..//utils/extractAirportCode";
interface ScrapeFlightParams {
  tripType: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  travelClass: string;
  travellers: string;
}

export const scrapeFlightData = async ({
  tripType,
  from,
  to,
  departureDate,
  returnDate,
  travelClass,
  travellers,
}: ScrapeFlightParams): Promise<any>=> { 
    
  try {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    
    // Safely extract airport codes
    const fromCode = extractAirportCode(from);
    const toCode = extractAirportCode(to);
    
    const url = `https://www.qatarairways.com/app/booking/flight-selection?widget=QR&searchType=F&addTaxToFare=Y&minPurTime=0&selLang=en&tripType=${tripType === 'oneWay' ? 'O' : 'R'}&fromStation=${fromCode}&toStation=${toCode}&departing=${departureDate}&bookingClass=${travelClass === 'Economy' ? 'E' : ''}&adults=${travellers}&children=0&infants=0&ofw=0&teenager=0&returning=${returnDate || ''}&flexibleDate=off`;
    
    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    
    console.log("Scrolling down to load more flights...");
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    
    console.log("Waiting for flight data...");
    await page.waitForSelector(".flight-card", { timeout: 60000 });
    
    console.log("Extracting flight data...");
    const flights = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".flight-card")).map(el => el.textContent?.trim() || "")
    );
    
    console.log("Extracted flight data:", flights);
    
    // await browser.close();
    return processFlights(flights);
  } catch (error) {
    console.error("Error scraping flight data:", error);
    throw error;
  }
};

// Helper function to safely extract airport codes
