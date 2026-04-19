import { SET_SELECTED_TRIP, CLEAR_SELECTED_TRIP } from './actionTypes';
import Trip from '../database/model/Trip';

interface TripData {
  id: string;
  name: string;
  destinationCityId: string;
  destinationCityName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const setSelectedTrip = (trip: {
  id: string;
  name: string;
  destination: string;
  destinationId: string;
  description: string;
  startTime: Date;
  endTime: Date;
  userId: string;
}) => ({
  type: 'SET_SELECTED_TRIP',
  payload: trip,
});

export const clearSelectedTrip = () => ({
  type: CLEAR_SELECTED_TRIP,
}); 