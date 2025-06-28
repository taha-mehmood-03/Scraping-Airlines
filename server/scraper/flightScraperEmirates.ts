import puppeteer from "puppeteer";
import { ScrapeFlightParams } from "@/lib/api/Flightsapi";
import { generateEmiratesUrl } from "../../utils/generateEmiratesUrl";

interface FlightData {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: string;
}

export const scrapeFlightDataEmirates = async (params: ScrapeFlightParams): Promise<any> => {
  let browser = null;

  try {
    console.log("🛫 Starting Emirates scraper...");

    const { url, fromCode, toCode } = generateEmiratesUrl(params);
    const { from, to, departureDate, returnDate = "", travelClass = "Economy" } = params;

    console.log("🔗 Navigating to:", url);

    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--window-size=1920,1080",
        "--disable-blink-features=AutomationControlled",
      ],
      timeout: 90000,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });

    page.on("console", msg => console.log("PAGE LOG:", msg.text()));

    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

    console.log("✅ Page loaded. Checking for errors...");

    const hasError = await page.evaluate(() => {
      const errorElement = document.querySelector(".error-msg");
      const errorCode = document.querySelector(".error-code");
      return errorElement?.textContent || errorCode?.textContent || null;
    });

    if (hasError) {
      console.error("⚠️ Emirates search error detected:", hasError);
      await browser.close();
      return {
        airline: "Emirates",
        from,
        to,
        departureDate,
        returnDate,
        travelClass,
        flights: [],
        error: hasError,
      };
    }

    console.log("✅ No errors detected. Waiting for flight results...");

    try {
      await page.waitForSelector(".flight-card-collapsed__wrapper", { timeout: 60000 });
      console.log("🎯 Flight results found");
    } catch {
      console.warn("⚠️ Flight results timeout");
      await page.screenshot({ path: "emirates-debug.png", fullPage: true });

      const alternateContent = await page.evaluate(() => document.body.innerText.substring(0, 500));
      console.log("Page content preview:", alternateContent);
    }

    const flightResults: FlightData[] = await page.evaluate(() => {
      const results: FlightData[] = [];
      const cards = document.querySelectorAll(".flight-card-collapsed__wrapper");

      cards.forEach((card) => {
        try {
          const getText = (sel: string) => (card.querySelector(sel)?.textContent ?? "").trim();
          
          // Get complete price with currency
          let priceWithCurrency = "";
          
          // Try the price container first which should have both currency and amount
          const priceContainer = card.querySelector(".flight-card-collapsed__price-container");
          if (priceContainer) {
            // Extract the full price text including currency symbol
            priceWithCurrency = priceContainer.textContent?.trim() || "N/A";
            // Clean up the text to include just the currency and amount
            priceWithCurrency = priceWithCurrency.replace(/[^0-9\$\€\£\¥\₹\د\.إ\﷼\₽\₺\.\,]/g, "").trim();
          }
          
          // If not found in the price container, try to combine currency and amount
          if (!priceWithCurrency || priceWithCurrency === "N/A") {
            const currencySymbol = card.querySelector(".currency-cash__code")?.textContent?.trim() || "";
            const priceAmount = getText(".currency-cash__amount") || "N/A";
            priceWithCurrency = currencySymbol + priceAmount;
          }

          results.push({
            airline: (card.querySelector(".tail-info img")?.getAttribute("alt") ?? "Emirates").replace("Operated by ", ""),
            departureTime: getText(".flight-info__date-time-details.left .flight-info__date-time-details__time"),
            arrivalTime: getText(".flight-info__date-time-details.right .flight-info__date-time-details__time"),
            stops: getText(".flight-info__infographic__nonstop-cta") || "Non-stop",
            duration: getText(".flight-info__infographic__duration"),
            price: priceWithCurrency || "N/A",
          });
        } catch (err) {
          console.log("Error parsing card:", err);
        }
      });

      return results;
    });

    console.log(`✅ Extracted ${flightResults.length} flights`);

    await new Promise(resolve => setTimeout(resolve, 3000));
    // await browser.close();

    return flightResults.map(flight => ({
      airline: flight.airline,
      arrivalAirport: toCode,
      arrivalTime: flight.arrivalTime,
      departureAirport: fromCode,
      departureTime: flight.departureTime,
      duration: flight.duration,
      stops: flight.stops.replace("Opens a dialog", "").trim(),
      price: flight.price,
    }));
  } catch (error: any) {
    console.error("❌ Scraper error:", error.message);

    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length) {
          await pages[0].screenshot({ path: "emirates-error.png", fullPage: true });
        }
      } catch (e) {
        console.error("Screenshot failed", e);
      }

      await browser.close();
    }

    return {
      airline: "Emirates",
      from: params?.from || "",
      to: params?.to || "",
      departureDate: params?.departureDate || "",
      returnDate: params?.returnDate || "",
      travelClass: params?.travelClass || "",
      flights: [],
      error: error.message,
    };
  }
};