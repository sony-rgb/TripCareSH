import Flight from '../../database/model/Flight';

export interface IAirlineRepository {
  createFlight(flightData: { departureDate: Date; userId: string }): Promise<Flight>;
  updateFlight(flight: Flight, newDepartureDate: Date): Promise<Flight>;
  findFlightsByUserId(userId: string): Promise<Flight[]>;
} 