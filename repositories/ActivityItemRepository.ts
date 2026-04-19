import { Q } from '@nozbe/watermelondb';
import database from '../database/init';
import ActivityItem from '../database/model/ActivityItem';
import { IActivityItemRepository } from './interfaces/IActivityItemRepository';

export default class ActivityItemRepository implements IActivityItemRepository {
  async create(activityData: Partial<ActivityItem>): Promise<ActivityItem> {
    const collection = database.get<ActivityItem>('activity_items');
    if (!activityData.userId) {
      throw new Error('userId is required to create an activity item');
    }
    return await database.write(async () => {
      const newActivity = await collection.create(activity => {
        Object.assign(activity, {
          ...activityData,
          isCompleted: activityData.isCompleted ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
          dbSyncStatus: 'pending',
          dbSyncChanged: new Date().toISOString(),
        });
      });
      return newActivity;
    });
  }

  async update(activity: ActivityItem, activityData: Partial<ActivityItem>): Promise<ActivityItem> {
    await database.write(async () => {
      await activity.update(a => {
        if (activityData.tripItemId) a.tripItemId = activityData.tripItemId;
        if (activityData.title) a.title = activityData.title;
        if (activityData.description !== undefined) a.description = activityData.description;
        if (activityData.venue !== undefined) a.venue = activityData.venue;
        if (activityData.address !== undefined) a.address = activityData.address;
        if (activityData.startDate !== undefined) a.startDate = activityData.startDate;
        if (activityData.startTime !== undefined) a.startTime = activityData.startTime;
        if (activityData.endDate !== undefined) a.endDate = activityData.endDate;
        if (activityData.endTime !== undefined) a.endTime = activityData.endTime;
        if (activityData.isCompleted !== undefined) a.isCompleted = activityData.isCompleted;
        a.updatedAt = new Date();
        a.dbSyncStatus = 'pending';
        a.dbSyncChanged = new Date().toISOString();
      });
    });

    return activity;
  }

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const activity = await this.findById(id);
      if (!activity) {
        throw new Error('ActivityItem not found');
      }
      activity.markAsDeleted();
    });
    
    // Trigger immediate sync after deletion
    this.triggerSync();
  }

  async findById(id: string): Promise<ActivityItem | null> {
    const activities = await database.get<ActivityItem>('activity_items')
      .query(Q.where('id', id))
      .fetch();
    return activities.length > 0 ? activities[0] : null;
    }

  async findAll(): Promise<ActivityItem[]> {
    return await database.get<ActivityItem>('activity_items').query(
      Q.sortBy('start_date', Q.desc)
    ).fetch();
  }

  async findByTripItemId(tripItemId: string): Promise<ActivityItem | null> {
    const activities = await database.get<ActivityItem>('activity_items')
      .query(Q.where('trip_item_id', tripItemId))
      .fetch();
    return activities.length > 0 ? activities[0] : null;
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
        console.log('✅ Background sync triggered successfully after activity deletion');
      } catch (error) {
        console.error('⚠️ Background sync failed (non-fatal):', error);
        // Don't throw - sync failures shouldn't block UI operations
      }
    }, 100); // Small delay to ensure DB write completes
  }
}

