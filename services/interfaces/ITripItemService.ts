import TripItem from '../../database/model/TripItem';
import ActivityItem from '../../database/model/ActivityItem';

export interface ITripItemService {
    getTripItems(tripId: string): Promise<(TripItem & { activity?: ActivityItem | null })[]>;
    getTripItemsByType(tripId: string, type: string): Promise<TripItem[]>;
    getTripItemsByStatus(tripId: string, status: string): Promise<TripItem[]>;
    createTripItem(tripItemData: Partial<TripItem>): Promise<TripItem | null>;
    updateTripItem(id: string, updates: Partial<TripItem>): Promise<boolean>;
    deleteTripItem(id: string): Promise<boolean>;
}
