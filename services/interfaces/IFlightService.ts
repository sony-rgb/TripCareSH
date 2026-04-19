import TripItem from '../../database/model/TripItem';

export interface IFlightService {
  getFlightByTripItemId(tripItemId: string): Promise<TripItem | null>;
  createFlightWithTripItem(
    tripId: string,
    userId: string,
    flightData: any,
    airline: string,
    flightNumber: string
  ): Promise<{ tripItem: TripItem } | null>;
  updateFlightWithTripItem(
    tripItemId: string,
    userId: string,
    flightData: any,
    airline: string,
    flightNumber: string
  ): Promise<{ tripItem: TripItem } | null>;
  formatFlightDataForDatabase(
    apiData: any,
    tripItemId: string,
    userId: string,
    airline: string,
    flightNumber: string
  ): Partial<TripItem>;
}
