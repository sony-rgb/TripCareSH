import { ITripRepository } from '../repositories/interfaces/ITripRepository';
import { IAuthService } from './interfaces/IAuthService';
import Trip from '../database/model/Trip';
import i18next from 'i18next'; // Use i18next directly instead of useTranslation hook
import { ITripService } from './interfaces/ITripService';

export class TripService implements ITripService {
    private tripRepository: ITripRepository;
    private authService: IAuthService;
    
    constructor(tripRepository: ITripRepository, authService: IAuthService) {
        this.tripRepository = tripRepository;
        this.authService = authService;
    }

    async getTrips(): Promise<Trip[]> {
        try {
            // Get the current logged-in user's ID
            const currentUser = await this.authService.getCurrentUser();
            if (!currentUser || !currentUser.id) {
                console.warn('⚠️ [TripService.getTrips] No authenticated user found');
                return [];
            }
            
            console.log('🔍 [TripService.getTrips] Fetching trips for user:', currentUser.id);
            
            // Fetch trips filtered by the current user's ID
            const trips = await this.tripRepository.findAll(currentUser.id);
            
            console.log(`✅ [TripService.getTrips] Found ${trips.length} trips for user ${currentUser.id}`);
            return trips;
        } catch (error) {
            console.error('❌ [TripService.getTrips] Error fetching trips:', error);
            return [];
        }
    }

    async getTripById(tripId: string): Promise<Trip | null> {
        return await this.tripRepository.findById(tripId);
    }

    async create(
        name: string, 
        destinationId: string,
        destination: string,
        description: string,
        startTime: Date, 
        endTime: Date, 
        userId: string,
    ): Promise<Trip> {

        if (!name || !startTime || !endTime || !destinationId || !destination) {
            throw new Error(i18next.t('trip_add_required_fields'));
        }

        if (name.length > 80) {
            throw new Error(i18next.t('trip_add_name_length'));
        }

        if (description && description.length > 500) {
            throw new Error(i18next.t('trip_add_description_length'));
        }

        if (startTime > endTime) {
            throw new Error(i18next.t('trip_add_start_date_after_end_date'));
        }

        const tripData = {
            name: name.trim(),
            destinationId: destinationId,
            destination: destination,
            description: description ? description.trim() : '',
            startTime: startTime,
            endTime: endTime,
            userId: userId,
        };

        return await this.tripRepository.create(tripData);
    }

    async update(tripId: string, updates: {
        name?: string,
        destination?: string,
        destinationId?: string,
        description?: string,
        startTime?: Date,
        endTime?: Date
    }): Promise<Trip> {
        const trip = await this.tripRepository.findById(tripId);
        if (!trip) {
            throw new Error("Trip not found");
        }

        if (updates.name && updates.name.length > 150) {
            throw new Error("Trip name cannot exceed 150 characters");
        }

        if (updates.description && updates.description.length > 500) {
            throw new Error("Trip description cannot exceed 500 characters");
        }

        const startTime = updates.startTime || trip.startTime;
        const endTime = updates.endTime || trip.endTime;
        if (startTime > endTime) {
            throw new Error("Start time cannot be after end time");
        }

        const tripData = {
            ...updates,
            name: updates.name?.trim(),
            destination: updates.destination?.trim(),
            description: updates.description?.trim()
        };

        return await this.tripRepository.update(trip, tripData);
    }

    async delete(tripId: string): Promise<void> {
        return await this.tripRepository.delete(tripId);
    }

    /**
     * Search trips by name, destination, or description
     * @param trips - Array of trips to search through
     * @param searchQuery - Search term to filter by
     * @returns Filtered array of trips matching the search criteria
     */
    searchTrips(trips: Trip[], searchQuery: string): Trip[] {
        if (!searchQuery.trim()) {
            return trips;
        }
        
        const query = searchQuery.toLowerCase().trim();
        return trips.filter(trip => {
            const name = trip.name?.toLowerCase() || '';
            const destination = trip.destination?.toLowerCase() || '';
            const description = trip.description?.toLowerCase() || '';
            
            return name.includes(query) || 
                   destination.includes(query) || 
                   description.includes(query);
        });
    }

    /**
     * Get trips that start in the future (upcoming trips)
     * @param trips - Array of trips to filter
     * @returns Array of upcoming trips
     */
    getUpcomingTrips(trips: Trip[]): Trip[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return trips.filter(trip => trip.startTime >= today);
    }

    /**
     * Get trips that have already started (past trips)
     * @param trips - Array of trips to filter
     * @returns Array of past trips
     */
    getPastTrips(trips: Trip[]): Trip[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return trips.filter(trip => trip.startTime < today);
    }

    /**
     * Get trips that start in the current month
     * @param trips - Array of trips to filter
     * @returns Array of trips starting this month
     */
    getTripsThisMonth(trips: Trip[]): Trip[] {
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth());
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 1);
        
        return trips.filter(trip => {
            const tripDate = new Date(trip.startTime);
            return tripDate >= thisMonth && tripDate < nextMonth;
        });
    }
}
