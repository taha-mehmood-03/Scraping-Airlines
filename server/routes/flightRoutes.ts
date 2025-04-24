import { Router } from "express";
import { getFlights, storeOrUpdateFlights } from "../controllers/flightController";

const router = Router();

// Define routes
router.get("/", getFlights);
router.post("/storing", storeOrUpdateFlights);

export default router;