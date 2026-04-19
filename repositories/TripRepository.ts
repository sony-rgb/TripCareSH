import { ITripRepository } from './interfaces/ITripRepository';
import { Q } from '@nozbe/watermelondb';
import database from '../database/init';
import Trip from '../database/model/Trip';

export default class TripRepository implements ITripRepository {
  async findById(id: string): Promise<Trip | null> {
    const trips = await database.get<Trip>('trips').query(Q.where('id', id)).fetch();
    return trips.length > 0 ? trips[0] : null;
  }

  async findAll(userId?: string): Promise<Trip[]> {
    const query = database.get<Trip>('trips').query(
      Q.sortBy('start_time', Q.desc)
    );
    
    // If userId is provided, filter by that user
    if (userId) {
      return await database.get<Trip>('trips').query(
        Q.where('user_id', userId),
        Q.sortBy('start_time', Q.desc)
      ).fetch();
    }
    
    // Otherwise return all trips (for backward compatibility)
    return await query.fetch();
  }

  async create(tripData: Partial<Trip>): Promise<Trip> {
    const tripCollection = database.get<Trip>('trips');
    if (!tripData.userId) {
      throw new Error('userId is required to create a trip');
    }
    const newTrip = await database.write(async () => {
      const trip = await tripCollection.create(t => {
        Object.assign(t, tripData);
      });
      return trip;
    });
    
    // Trigger immediate sync after creation
    this.triggerSync();
    
    return newTrip;
  }

  async update(trip: Trip, tripData: Partial<Trip>): Promise<Trip> {    
    await database.write(async () => { 
      await trip.update(t => {
        if (tripData.name) t.name = tripData.name;
        if (tripData.destination) t.destination = tripData.destination;
        if (tripData.destinationId) t.destinationId = tripData.destinationId;
        if (tripData.description !== undefined) t.description = tripData.description;
        if (tripData.startTime) t.startTime = tripData.startTime;
        if (tripData.endTime) t.endTime = tripData.endTime;
      });
    });

    const updatedTrip = await this.findById(trip.id);
    if (!updatedTrip) {
      throw new Error("Unexpected error");
    }
    
    // Trigger immediate sync after update
    this.triggerSync();

    return updatedTrip;
  }

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const trip = await this.findById(id);
      if (!trip) {
        throw new Error("Trip not found");
      }

      // await db.collections.get('your_collection_name').find('record_id').markAsDeleted();

      trip.markAsDeleted();
    });
    
    // Trigger immediate sync after deletion
    this.triggerSync();
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
        console.log('✅ Background sync triggered successfully');
      } catch (error) {
        console.error('⚠️ Background sync failed (non-fatal):', error);
        // Don't throw - sync failures shouldn't block UI operations
      }
    }, 100); // Small delay to ensure DB write completes
  }
} 