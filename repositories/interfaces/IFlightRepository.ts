import Flight from '../../database/model/Flight';

export interface IFlightRepository {
  create(flightData: Partial<Flight>): Promise<Flight>;
  update(flight: Flight, flightData: Partial<Flight>): Promise<Flight>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Flight | null>;
  findAll(): Promise<Flight[]>;
  findByTripItemId(tripItemId: string): Promise<Flight | null>;
}
