import { IAirlineRepository } from './interfaces/IAirlineRepository';
import { Q } from '@nozbe/watermelondb';
import database from '../database/init';
import Flight from '../database/model/Flight';

export default class AirlineRepository implements IAirlineRepository {
  async createFlight(flightData: { departureDate: Date; userId: string }): Promise<Flight> {
    const flightCollection = database.get<Flight>('flights');
    return await database.write(async () => {
      const newFlight = await flightCollection.create(flight => {
        flight.departureDate = flightData.departureDate;
        flight.userId = flightData.userId;
      });
      return newFlight;
    });
  }

  async findFlightsByUserId(userId: string): Promise<Flight[]> {
    return await database.get<Flight>('flights')
      .query(Q.where('user_id', userId))
      .fetch();
  }

  async updateFlight(flight: Flight, newDepartureDate: Date): Promise<Flight> {
    await database.write(async () => {
      await flight.update(f => {
        f.departureDate = newDepartureDate;
      });
    });

    return flight;
  }
} 