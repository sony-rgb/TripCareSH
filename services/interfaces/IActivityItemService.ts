import TripItem from '../../database/model/TripItem';

export interface IActivityItemService {
  createActivityWithTripItem(
    tripId: string,
    userId: string,
    payload: {
      title: string;
      description?: string;
      venue?: string;
      address?: string;
      startDate: Date;
      endDate?: Date | null;
      startTime?: string;
      endTime?: string;
      isCompleted?: boolean;
    }
  ): Promise<{ tripItem: TripItem } | null>;

  getActivityByTripItemId(tripItemId: string): Promise<TripItem | null>;

  updateActivityWithTripItem(
    tripItemId: string,
    payload: {
      title: string;
      description?: string;
      venue?: string;
      address?: string;
      startDate: Date;
      endDate?: Date | null;
      startTime?: string;
      endTime?: string;
      isCompleted?: boolean;
    }
  ): Promise<{ tripItem: TripItem } | null>;
}

