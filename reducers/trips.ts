import Trip from '../database/model/Trip';
import { SET_SELECTED_TRIP, CLEAR_SELECTED_TRIP } from '../actions/actionTypes';

interface TripState {
  selectedTrip: {
    id: string;
    name: string;
    destination: string;
    destinationId: string;
    description: string;
    startTime: Date;
    endTime: Date;
    userId: string;
  } | null;
}

const initialState: TripState = {
  selectedTrip: null,
};

const tripsReducer = (state = initialState, action: any): TripState => {
  switch (action.type) {
    case 'SET_SELECTED_TRIP':
      return {
        ...state,
        selectedTrip: {
          id: action.payload.id,
          name: action.payload.name,
          destination: action.payload.destination,
          destinationId: action.payload.destinationId,
          description: action.payload.description,
          startTime: action.payload.startTime,
          endTime: action.payload.endTime,
          userId: action.payload.userId,
        },
      };
    default:
      return state;
  }
};

export default tripsReducer; 