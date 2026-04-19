import { IFlightRepository } from './interfaces/IFlightRepository';
import { Q } from '@nozbe/watermelondb';
import database from '../database/init';
import Flight from '../database/model/Flight';

export default class FlightRepository implements IFlightRepository {
  async create(flightData: Partial<Flight>): Promise<Flight> {
    const flightCollection = database.get<Flight>('flights');
    if (!flightData.userId) {
      throw new Error('userId is required to create a flight');
    }
    return await database.write(async () => {
      const newFlight = await flightCollection.create(flight => {
        Object.assign(flight, {
          ...flightData,
          createdAtUtc: new Date(),
          updatedAtUtc: new Date(),
          dbSyncStatus: 'pending',
          dbSyncChanged: new Date().toISOString()
        });
      });
      return newFlight;
    });
  }

  async update(flight: Flight, flightData: Partial<Flight>): Promise<Flight> {
    await database.write(async () => {
      await flight.update(f => {
        if (flightData.tripItemId) f.tripItemId = flightData.tripItemId;
        if (flightData.airline) f.airline = flightData.airline;
        if (flightData.flightNumber) f.flightNumber = flightData.flightNumber;
        if (flightData.departureAirport) f.departureAirport = flightData.departureAirport;
        if (flightData.arrivalAirport) f.arrivalAirport = flightData.arrivalAirport;
        if (flightData.departureTimeLocal) f.departureTimeLocal = flightData.departureTimeLocal;
        if (flightData.departureTimeUtc) f.departureTimeUtc = flightData.departureTimeUtc;
        if (flightData.arrivalTimeLocal) f.arrivalTimeLocal = flightData.arrivalTimeLocal;
        if (flightData.arrivalTimeUtc) f.arrivalTimeUtc = flightData.arrivalTimeUtc;
        if (flightData.confirmationNumber !== undefined) f.confirmationNumber = flightData.confirmationNumber;
        if (flightData.notes !== undefined) f.notes = flightData.notes;
        f.updatedAtUtc = new Date();
        f.dbSyncStatus = 'pending';
        f.dbSyncChanged = new Date().toISOString();
      });
    });

    return flight;
  }

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const flight = await this.findById(id);
      if (!flight) {
        throw new Error("Flight not found");
      }
      flight.markAsDeleted();
    });
    
    // Trigger immediate sync after deletion
    this.triggerSync();
  }

  async findById(id: string): Promise<Flight | null> {
    const flights = await database.get<Flight>('flights').query(Q.where('id', id)).fetch();
    return flights.length > 0 ? flights[0] : null;
  }

  async findAll(): Promise<Flight[]> {
    return await database.get<Flight>('flights').query(
      Q.sortBy('departure_time_local', Q.desc)
    ).fetch();
  }

  async findByTripItemId(tripItemId: string): Promise<Flight | null> {
    const flights = await database.get<Flight>('flights')
      .query(Q.where('trip_item_id', tripItemId))
      .fetch();
    return flights.length > 0 ? flights[0] : null;
  }
  
  /**
   * Trigger background sync after data changes
   * Non-blocking - errors are caught and logged
   */
  private triggerSync(): void {
    // Import lazily to avoid circular dependencies
    setTimeout(async () => {
      try {
        const { container } = require('../services');
        await container.getSyncService().sync();
        console.log('✅ Background sync triggered successfully after flight deletion');
      } catch (error) {
        console.error('⚠️ Background sync failed (non-fatal):', error);
        // Don't throw - sync failures shouldn't block UI operations
      }
    }, 100); // Small delay to ensure DB write completes
  }
}
