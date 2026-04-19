import TripItem from '../database/model/TripItem';
import Flight from '../database/model/Flight';
import { ITripItemRepository } from '../repositories/interfaces/ITripItemRepository';
import { IFlightRepository } from '../repositories/interfaces/IFlightRepository';
import { IFlightService } from './interfaces/IFlightService';
import { FlightInfo } from '../screens/FlightAdd';

export class FlightService implements IFlightService {
  constructor(
    private tripItemRepository: ITripItemRepository,
    private flightRepository: IFlightRepository
  ) {}

  async getFlightByTripItemId(tripItemId: string): Promise<any | null> {
    try {
      const tripItem = await this.tripItemRepository.findById(tripItemId);
      if (!tripItem || tripItem.type !== 'flight') {
        return null;
      }

      // Fetch the associated flight for complete data
      const flight = await this.flightRepository.findByTripItemId(tripItemId);
      
      if (!flight) {
        console.warn('Flight record not found for trip item:', tripItemId);
        // Return tripItem with empty flight fields for backward compatibility
        return {
          ...tripItem,
          airline: '',
          flightNumber: '',
          departureAirport: '',
          arrivalAirport: '',
          departureTimeLocal: null,
          departureTimeUtc: null,
          arrivalTimeLocal: null,
          arrivalTimeUtc: null,
          confirmationNumber: '',
          notes: '',
        };
      }

      // Combine data from both tables
      const combinedFlight = {
        // From TripItem (generic fields)
        id: tripItem.id,
        tripId: tripItem.tripId,
        userId: tripItem.userId,
        type: tripItem.type,
        title: tripItem.title,
        description: tripItem.description,
        startDate: flight.departureTimeLocal || tripItem.startDate,
        endDate: flight.arrivalTimeLocal || tripItem.endDate,
        status: tripItem.status,
        icon: tripItem.icon,
        createdAt: tripItem.createdAt,
        updatedAt: tripItem.updatedAt,
        
        // From Flight (flight-specific fields)
        flightId: flight.id,
        airline: flight.airline || '',
        flightNumber: flight.flightNumber || '',
        departureAirport: flight.departureAirport || '',
        arrivalAirport: flight.arrivalAirport || '',
        departureTimeLocal: flight.departureTimeLocal,
        departureTimeUtc: flight.departureTimeUtc,
        arrivalTimeLocal: flight.arrivalTimeLocal,
        arrivalTimeUtc: flight.arrivalTimeUtc,
        confirmationNumber: flight.confirmationNumber || '',
        notes: flight.notes || '',
      };

      console.log('Fetched combined flight data:', {
        tripItemId,
        flightId: flight.id,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        hasConfirmation: !!flight.confirmationNumber
      });

      return combinedFlight;
    } catch (error) {
      console.error('Error fetching flight by trip item ID:', error);
      return null;
    }
  }

  async updateFlightWithTripItem(
    tripItemId: string,
    userId: string,
    flightData: FlightInfo,
    airline: string,
    flightNumber: string
  ): Promise<{ tripItem: TripItem } | null> {
    try {
      const departureDateTime = new Date(flightData.departureDateTime);
      const arrivalDateTime = new Date(flightData.arrivalTime);

      // Find the TripItem
      const tripItem = await this.tripItemRepository.findById(tripItemId);
      if (!tripItem || tripItem.type !== 'flight') {
        console.error('Trip item not found or not a flight:', tripItemId);
        return null;
      }

      // Update TripItem with generic fields
      const updatedTripItem = await this.tripItemRepository.update(tripItem, {
        title: `${airline} ${flightNumber}`,
        description: `Flight from ${flightData.departureAirport} to ${flightData.arrivalAirport}`,
        startDate: departureDateTime,
        endDate: arrivalDateTime,
        status: 'Booked',
      });

      // Find and update the Flight
      let flight = await this.flightRepository.findByTripItemId(tripItemId);
      
      if (flight) {
        // Update existing flight
        await this.flightRepository.update(flight, {
          airline,
          flightNumber,
          departureAirport: flightData.departureAirport,
          arrivalAirport: flightData.arrivalAirport,
          departureTimeLocal: departureDateTime,
          departureTimeUtc: departureDateTime, // TODO: Convert to UTC properly
          arrivalTimeLocal: arrivalDateTime,
          arrivalTimeUtc: arrivalDateTime, // TODO: Convert to UTC properly
        });
      } else {
        // Create flight if it doesn't exist (migration scenario)
        console.log('Flight record not found, creating one for trip item:', tripItemId);
        await this.flightRepository.create({
          userId,
          tripItemId: tripItem.id,
          airline,
          flightNumber,
          departureAirport: flightData.departureAirport,
          arrivalAirport: flightData.arrivalAirport,
          departureTimeLocal: departureDateTime,
          departureTimeUtc: departureDateTime,
          arrivalTimeLocal: arrivalDateTime,
          arrivalTimeUtc: arrivalDateTime,
          confirmationNumber: undefined,
          notes: undefined,
        });
      }

      console.log('Successfully updated flight and trip item:', {
        tripItemId,
        airline,
        flightNumber
      });

      return { tripItem: updatedTripItem };
    } catch (error) {
      console.error('Error updating flight trip item:', error);
      return null;
    }
  }

  async createFlightWithTripItem(
    tripId: string, 
    userId: string,
    flightData: FlightInfo, 
    airline: string, 
    flightNumber: string
  ): Promise<{ tripItem: TripItem } | null> {
    try {
      const departureDateTime = new Date(flightData.departureDateTime);
      const arrivalDateTime = new Date(flightData.arrivalDateTime);
      
      // Create TripItem with generic fields only
      const tripItem = await this.tripItemRepository.create({
        userId,
        tripId,
        type: 'flight',
        title: `${airline} ${flightNumber}`,
        description: `Flight from ${flightData.departureAirport} to ${flightData.arrivalAirport}`,
        startDate: departureDateTime,
        endDate: arrivalDateTime,
        status: 'Booked',
        icon: 'plane',
      });

      // Create Flight with flight-specific fields
      const flight = await this.flightRepository.create({
        userId,
        tripItemId: tripItem.id,
        airline,
        flightNumber,
        departureAirport: flightData.departureAirport,
        arrivalAirport: flightData.arrivalAirport,
        departureTimeLocal: departureDateTime,
        departureTimeUtc: departureDateTime, // TODO: Convert to UTC properly
        arrivalTimeLocal: arrivalDateTime,
        arrivalTimeUtc: arrivalDateTime, // TODO: Convert to UTC properly
        confirmationNumber: undefined,
        notes: undefined,
      });

      console.log('Successfully created flight and trip item:', { 
        tripItemId: tripItem.id,
        flightId: flight.id,
        tripId,
        airline,
        flightNumber
      });

      return { tripItem };
    } catch (error) {
      console.error('Error creating flight trip item:', error);
      return null;
    }
  }

  /**
   * Helper method to convert API flight data to database format
   * Returns only TripItem generic fields (flight-specific data goes to Flight table)
   */
  formatFlightDataForDatabase(
    apiData: FlightInfo,
    tripItemId: string,
    userId: string,
    airline: string,
    flightNumber: string
  ): Partial<TripItem> {
    const departureDateTime = new Date(apiData.departureDateTime);
    const arrivalDateTime = new Date(apiData.arrivalTime);
    
    return {
      userId,
      type: 'flight',
      title: `${airline} ${flightNumber}`,
      description: `Flight from ${apiData.departureAirport} to ${apiData.arrivalAirport}`,
      startDate: departureDateTime,
      endDate: arrivalDateTime,
      status: 'Booked',
      icon: 'plane',
    };
  }
}
