import type { Flight } from "../types/Flight.interface";

const FLIGHT_API_URL='/data/flights.json';

const getFlights=async(searchDate: number): Promise<Flight>=>{
    const response=await fetch
}