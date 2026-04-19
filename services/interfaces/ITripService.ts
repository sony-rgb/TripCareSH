import Trip from '../../database/model/Trip';

export interface ITripService {
    getTrips(): Promise<Trip[]>;
    getTripById(tripId: string): Promise<Trip | null>;
    create(
        name: string, 
        destinationId: string,
        destination: string,
        description: string,
        startTime: Date, 
        endTime: Date, 
        userId: string,
    ): Promise<Trip>;
    update(tripId: string, updates: {
        name?: string,
        destination?: string,
        destinationId?: string,
        description?: string,
        startTime?: Date,
        endTime?: Date
    }): Promise<Trip>;
    delete(tripId: string): Promise<void>;
    searchTrips(trips: Trip[], searchQuery: string): Trip[];
    getUpcomingTrips(trips: Trip[]): Trip[];
    getPastTrips(trips: Trip[]): Trip[];
    getTripsThisMonth(trips: Trip[]): Trip[];
} 