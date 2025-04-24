import { Request, Response } from "express";
import FlightModel, { IFlight } from "../../lib/db/models/Flights";

const STALE_LIMIT = 10 * 60 * 1000; // 10 minutes

// Store or update flight data in the database
export const storeOrUpdateFlights = async (req: Request, res: Response): Promise<void> => {
  const { from, to, departureDate, returnDate, travelClass, flights } = req.body;

  // Extract the airline from the first flight
  const airline = flights && flights.length > 0 ? flights[0].airline : null;

  if (!airline) {
    res.status(400).json({
      error: "Bad Request",
      details: "No airline information found in flights data"
    });
    return;
  }

  try {
    // Find flights with the same route parameters AND the same airline
    const existing = await FlightModel.findOne({
      from,
      to,
      departureDate,
      returnDate,
      travelClass,
      "flights.0.airline": airline // Look for flights where the first flight has the same airline
    });

    const now = new Date();

    if (existing) {
      const lastUpdated = new Date(existing.lastUpdatedAt);
      const age = now.getTime() - lastUpdated.getTime();

      if (age < STALE_LIMIT) {
        res.status(200).json({
          message: "Using cached data (not stale)",
          data: existing,
        });
        return;
      }

      // Update the existing flight data
      existing.flights = flights;
      existing.lastUpdatedAt = now;
      await existing.save();

      res.status(200).json({
        message: "Updated stale data",
        data: existing,
      });
      return;
    }

    // Create new flight entry
    const newFlight = await FlightModel.create({
      from,
      to,
      departureDate,
      returnDate,
      travelClass,
      flights,
      lastUpdatedAt: now,
    });

    res.status(201).json({
      message: "New data stored",
      data: newFlight,
    });
  } catch (error) {
    console.error("Error storing flight data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: (error as Error).message,
    });
  }
};

export const getFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to, departureDate, travelClass } = req.query as {
      from: string;
      to: string;
      departureDate: string;
      travelClass: string;
    };

    // Ensure all required query parameters are present
    if (!from || !to || !departureDate || !travelClass) {
      res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
      return;
    }

    // Fetch flight data from the database
    const flights = await FlightModel.find({
      from,
      to,
      departureDate,
      travelClass,
    });

    // If no flights found, return a 404 response
    if (!flights || flights.length === 0) {
      res.status(404).json({
        success: false,
        message: "No flights found",
      });
      return;
    }

    // Return the found flight data
    res.status(200).json({
      success: true,
      data: flights,  // Return the flight data
    });
  } catch (error) {
    console.error("Error in getFlights:", error);
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};