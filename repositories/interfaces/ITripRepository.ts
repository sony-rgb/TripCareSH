import Trip from '../../database/model/Trip';

export interface ITripRepository {
  create(tripData: Partial<Trip>): Promise<Trip>;
  update(trip: Trip, tripData: Partial<Trip>): Promise<Trip>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Trip | null>;
  findAll(userId?: string): Promise<Trip[]>;
} 