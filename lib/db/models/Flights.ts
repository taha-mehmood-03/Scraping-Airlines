import mongoose, { Schema, Document, Model } from "mongoose";

export interface FlightDetails {

  airline: string;
  departureTime: string;
  arrivalTime: string;
  stops: string;
  duration: string;
  price: string;
}

export interface IFlight extends Document {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travelClass: string;
  flights: FlightDetails[];
  lastUpdatedAt?: Date;
}

const FlightSchema = new Schema<IFlight>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: String, required: true },
    returnDate: { type: String, required: false },
    travelClass: { type: String, required: true },
    flights: [
      {
        airline: { type: String, required: true },
        departureTime: { type: String, required: true },
        arrivalTime: { type: String, required: true },
        stops: { type: String, required: true },
        duration: { type: String, required: true },
        price: { type: String, required: true },
      },
    ],
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const FlightModel: Model<IFlight> =
  mongoose.models.Flight || mongoose.model<IFlight>("Flight", FlightSchema);

export default FlightModel;
