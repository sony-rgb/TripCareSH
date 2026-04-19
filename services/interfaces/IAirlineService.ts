import Flight from '../../database/model/Flight';

export interface IAirlineService {
    createFlight(userId: string, departureDate: string): Promise<Flight>;
    updateFlight(flight: Flight, newDepartureDate: string): Promise<Flight>;
    deleteFlight(flight: Flight): Promise<void>;
    getUserFlights(userId: string): Promise<Flight[]>;
} 