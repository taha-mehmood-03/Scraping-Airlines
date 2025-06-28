// app/api/flights/route.ts
import { NextResponse } from 'next/server';
import FlightModel from '@/lib/db/models/Flights';
import connectDB from '@/lib/db';

const STALE_LIMIT = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
    try {
      // Connect to database
      await connectDB();
  
      const { searchParams } = new URL(request.url);
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      const departureDate = searchParams.get('departureDate');
      const travelClass = searchParams.get('travelClass');
  
      // Validate required parameters
      if (!from || !to || !departureDate || !travelClass) {
        return NextResponse.json(
          { success: false, message: "Missing required parameters" },
          { status: 400 }
        );
      }
  
      // Query flights from database
      const flights = await FlightModel.find({
        from,
        to,
        departureDate,
        travelClass,
      });
  
      if (!flights || flights.length === 0) {
        return NextResponse.json(
          { success: false, message: "No flights found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        success: true,
        data: flights,
      });
  
    } catch (error) {
      console.error("Error in GET flights:", error);
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }
  
  export async function POST(request: Request) {
    try {
      // Connect to database
      await connectDB();
  
      const { from, to, departureDate, returnDate, travelClass, flights } = await request.json();
      const airline = flights?.[0]?.airline;
  
      // Validate airline data
      if (!airline) {
        return NextResponse.json(
          { error: "Bad Request", details: "No airline information found" },
          { status: 400 }
        );
      }
  
      // Check for existing flights
      const existing = await FlightModel.findOne({
        from,
        to,
        departureDate,
        returnDate,
        travelClass,
        "flights.0.airline": airline
      });
  
      const now = new Date();
  
      // Handle existing flight data
      if (existing) {
        const age = now.getTime() - new Date(existing.lastUpdatedAt).getTime();
        
        // Return cached data if not stale
        if (age < STALE_LIMIT) {
          return NextResponse.json({
            message: "Using cached data (not stale)",
            data: existing,
          });
        }
  
        // Update stale data
        existing.flights = flights;
        existing.lastUpdatedAt = now;
        await existing.save();
  
        return NextResponse.json({
          message: "Updated stale data",
          data: existing,
        });
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
  
      return NextResponse.json(
        { message: "New data stored", data: newFlight },
        { status: 201 }
      );
  
    } catch (error) {
      console.error("Error in POST flights:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: (error as Error).message },
        { status: 500 }
      );
    }
  }