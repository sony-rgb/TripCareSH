import { IAirlineRepository } from '../repositories/interfaces/IAirlineRepository';
import Flight from '../database/model/Flight';

export class AirlineService {
    private airlineRepository: IAirlineRepository;
  
    constructor(airlineRepository: IAirlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    async createFlight(userId: string, departureDate: string): Promise<Flight> {
        if (!userId || !departureDate) {
            throw new Error("Please provide both user ID and departure date");
        }

        // Parse and validate the date string
        const parsedDate = new Date(departureDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format. Please provide a valid date string");
        }

        const flight = await this.airlineRepository.createFlight({
            userId,
            departureDate: parsedDate
        });

        return flight;
    }

    async updateFlight(flight: Flight, newDepartureDate: string): Promise<Flight> {
        if (!flight || !newDepartureDate) {
            throw new Error("Flight and new departure date are required");
        }

        // Parse and validate the date string
        const parsedDate = new Date(newDepartureDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format. Please provide a valid date string");
        }

        return await this.airlineRepository.updateFlight(flight, parsedDate);
    }

    async deleteFlight(flight: Flight): Promise<void> {
        if (!flight) {
            throw new Error("Flight is required");
        }

        throw new Error("Not implemented");
        //return await this.airlineRepository.deleteFlight(flight);
    }

    async getUserFlights(userId: string): Promise<Flight[]> {
        if (!userId) {
            throw new Error("User ID is required");
        }

        return await this.airlineRepository.findFlightsByUserId(userId);
    }
} 