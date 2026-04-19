import * as actionTypes from '../actions/actionTypes';

/**
 * Connectivity State Interface
 * Tracks the API connectivity status globally
 */
export interface ConnectivityState {
  apiReachable: boolean | null; // null = unknown/not checked yet
  checking: boolean;
  lastCheckedAt: number | null;
  error: string | null;
}

const initialState: ConnectivityState = {
  apiReachable: null,
  checking: false,
  lastCheckedAt: null,
  error: null,
};

/**
 * Connectivity Reducer
 * Manages API connectivity state in Redux
 */
export default (
  state: ConnectivityState = initialState,
  action: any = {}
): ConnectivityState => {
  switch (action.type) {
    case actionTypes.CHECK_HEALTH_START:
      return {
        ...state,
        checking: true,
        error: null,
      };

    case actionTypes.CHECK_HEALTH_SUCCESS:
      return {
        ...state,
        checking: false,
        apiReachable: action.payload.reachable,
        lastCheckedAt: action.payload.timestamp,
        error: null,
      };

    case actionTypes.CHECK_HEALTH_FAILURE:
      return {
        ...state,
        checking: false,
        apiReachable: false,
        lastCheckedAt: action.payload.timestamp,
        error: action.payload.error,
      };

    case actionTypes.RESET_CONNECTIVITY:
      return initialState;

    default:
      return state;
  }
};

