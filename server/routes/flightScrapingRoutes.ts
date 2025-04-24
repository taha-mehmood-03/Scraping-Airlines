import { Router } from "express";
import { scrapeFlights } from "../controllers/flightScrapingController";

const router = Router();
router.get("/scrape-flights", scrapeFlights);

export default router;