import { ITripItemRepository } from './interfaces/ITripItemRepository';
import { Q } from '@nozbe/watermelondb';
import database from '../database/init';
import TripItem from '../database/model/TripItem';

export default class TripItemRepository implements ITripItemRepository {
  async create(tripItemData: Partial<TripItem>): Promise<TripItem> {
    const tripItemCollection = database.get<TripItem>('trip_items');
    if (!tripItemData.userId) {
      throw new Error('userId is required to create a trip item');
    }
    const newTripItem = await database.write(async () => {
      const item = await tripItemCollection.create(tripItem => {
        Object.assign(tripItem, {
          ...tripItemData,
          createdAt: new Date(),
          updatedAt: new Date(),
          dbSyncStatus: 'pending',
          dbSyncChanged: new Date().toISOString()
        });
      });
      return item;
    });
    
    // Trigger immediate sync after creation
    this.triggerSync();
    
    return newTripItem;
  }

  async update(tripItem: TripItem, tripItemData: Partial<TripItem>): Promise<TripItem> {
    await database.write(async () => {
      await tripItem.update(ti => {
        if (tripItemData.tripId) ti.tripId = tripItemData.tripId;
        if (tripItemData.type) ti.type = tripItemData.type;
        if (tripItemData.title) ti.title = tripItemData.title;
        if (tripItemData.description !== undefined) ti.description = tripItemData.description;
        if (tripItemData.startDate !== undefined) ti.startDate = tripItemData.startDate;
        if (tripItemData.endDate !== undefined) ti.endDate = tripItemData.endDate;
        if (tripItemData.status) ti.status = tripItemData.status;
        if (tripItemData.icon) ti.icon = tripItemData.icon;
        if (tripItemData.location !== undefined) ti.location = tripItemData.location;
        if (tripItemData.bookingReference !== undefined) ti.bookingReference = tripItemData.bookingReference;
        if (tripItemData.notes !== undefined) ti.notes = tripItemData.notes;
        if (tripItemData.price !== undefined) ti.price = tripItemData.price;
        // Flight fields
        if (tripItemData.airline !== undefined) ti.airline = tripItemData.airline;
        if (tripItemData.flightNumber !== undefined) ti.flightNumber = tripItemData.flightNumber;
        if (tripItemData.departureAirport !== undefined) ti.departureAirport = tripItemData.departureAirport;
        if (tripItemData.arrivalAirport !== undefined) ti.arrivalAirport = tripItemData.arrivalAirport;
        if (tripItemData.departureTimeLocal !== undefined) ti.departureTimeLocal = tripItemData.departureTimeLocal;
        if (tripItemData.departureTimeUtc !== undefined) ti.departureTimeUtc = tripItemData.departureTimeUtc;
        if (tripItemData.arrivalTimeLocal !== undefined) ti.arrivalTimeLocal = tripItemData.arrivalTimeLocal;
        if (tripItemData.arrivalTimeUtc !== undefined) ti.arrivalTimeUtc = tripItemData.arrivalTimeUtc;
        if (tripItemData.confirmationNumber !== undefined) ti.confirmationNumber = tripItemData.confirmationNumber;
        // Activity fields
        if (tripItemData.venue !== undefined) ti.venue = tripItemData.venue;
        if (tripItemData.address !== undefined) ti.address = tripItemData.address;
        if (tripItemData.startTime !== undefined) ti.startTime = tripItemData.startTime;
        if (tripItemData.endTime !== undefined) ti.endTime = tripItemData.endTime;
        if (tripItemData.isCompleted !== undefined) ti.isCompleted = tripItemData.isCompleted;
        
        ti.updatedAt = new Date();
        ti.dbSyncStatus = 'pending';
        ti.dbSyncChanged = new Date().toISOString();
      });
    });
    
    // Trigger immediate sync after update
    this.triggerSync();

    return tripItem;
  }

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const tripItem = await this.findById(id);
      if (!tripItem) {
        throw new Error("TripItem not found");
      }
      tripItem.markAsDeleted();
    });
    
    // Trigger immediate sync after deletion
    this.triggerSync();
  }

  async findById(id: string): Promise<TripItem | null> {
    const tripItems = await database.get<TripItem>('trip_items').query(Q.where('id', id)).fetch();
    return tripItems.length > 0 ? tripItems[0] : null;
  }

  async findAll(): Promise<TripItem[]> {
    return await database.get<TripItem>('trip_items').query(
      Q.sortBy('created_at', Q.desc)
    ).fetch();
  }

  async findByTripId(tripId: string): Promise<TripItem[]> {
    return await database.get<TripItem>('trip_items')
      .query(Q.where('trip_id', tripId))
      .fetch();
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
