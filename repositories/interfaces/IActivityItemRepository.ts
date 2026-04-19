import ActivityItem from '../../database/model/ActivityItem';

export interface IActivityItemRepository {
  create(activityData: Partial<ActivityItem>): Promise<ActivityItem>;
  update(activity: ActivityItem, activityData: Partial<ActivityItem>): Promise<ActivityItem>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<ActivityItem | null>;
  findAll(): Promise<ActivityItem[]>;
  findByTripItemId(tripItemId: string): Promise<ActivityItem | null>;
}

