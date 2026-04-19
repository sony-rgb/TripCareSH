import * as actionTypes from './actionTypes';
import { checkApiHealth as apiHealthCheck } from '../config/api';

/**
 * Action Creators for Connectivity State
 */

const checkHealthStart = () => ({
  type: actionTypes.CHECK_HEALTH_START,
});

const checkHealthSuccess = (reachable: boolean) => ({
  type: actionTypes.CHECK_HEALTH_SUCCESS,
  payload: {
    reachable,
    timestamp: Date.now(),
  },
});

const checkHealthFailure = (error: string) => ({
  type: actionTypes.CHECK_HEALTH_FAILURE,
  payload: {
    error,
    timestamp: Date.now(),
  },
});

export const resetConnectivity = () => ({
  type: actionTypes.RESET_CONNECTIVITY,
});

/**
 * Check API Health Thunk
 * 
 * This thunk performs a health check against the API endpoint.
 * It updates the connectivity state in Redux based on the result.
 * 
 * Usage:
 *   dispatch(checkApiHealth())
 * 
 * Returns:
 *   Promise<boolean> - true if API is reachable, false otherwise
 */
export const checkApiHealth = () => async (dispatch: any): Promise<boolean> => {
  dispatch(checkHealthStart());

  try {
    const isReachable = await apiHealthCheck();
    dispatch(checkHealthSuccess(isReachable));
    return isReachable;
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error';
    dispatch(checkHealthFailure(errorMessage));
    return false;
  }
};

