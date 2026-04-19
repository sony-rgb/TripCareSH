import TripItem from '../../database/model/TripItem';

export interface ITripItemRepository {
  create(tripItemData: Partial<TripItem>): Promise<TripItem>;
  update(tripItem: TripItem, tripItemData: Partial<TripItem>): Promise<TripItem>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<TripItem | null>;
  findAll(): Promise<TripItem[]>;
  findByTripId(tripId: string): Promise<TripItem[]>;
}
