import express from "express";
import cors from "cors";
import connectDB from "../lib/db";
import flightScrapingRoutes from "./routes/flightScrapingRoutes"; // Qatar
import flightRoutes from "./routes/flightRoutes";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Mount routes
app.use("/api/scraping", flightScrapingRoutes);         // Qatar scraper: /api/scraping/qatar/scrape-flights
app.use("/api/flights", flightRoutes);                         // Flight related routes

// Test Route
app.get('/api/test-direct', (req, res) => {
  console.log("Direct test route hit!");
  res.json({ message: "Direct route working" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
