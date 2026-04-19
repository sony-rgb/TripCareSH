import * as actionTypes from '../actions/actionTypes';

/**
 * Auth Bootstrap Status
 * Represents the current state of the authentication bootstrap process
 */
export type AuthBootstrapStatus =
  | 'checking'
  | 'needsSignIn'
  | 'needsOnlineToSignIn'
  | 'authenticatedOnline'
  | 'authenticatedOffline';

/**
 * Auth State Interface
 * Enhanced to support offline-first auth with token expiry
 */
export interface AuthState {
  login: {
    success: boolean;
  };
  accessToken: string | null;
  expiresAt: number | null; // Unix timestamp in milliseconds
  bootstrapStatus: AuthBootstrapStatus;
}

const initialState: AuthState = {
  login: {
    success: false,
  },
  accessToken: null,
  expiresAt: null,
  bootstrapStatus: 'checking',
};

export default (state: AuthState = initialState, action: any = {}): AuthState => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        login: action.data,
      };

    case actionTypes.SET_AUTH_TOKEN:
      return {
        ...state,
        accessToken: action.payload.token,
        expiresAt: action.payload.expiresAt,
        login: {
          success: true,
        },
      };

    case actionTypes.SET_BOOTSTRAP_STATUS:
      return {
        ...state,
        bootstrapStatus: action.payload.status,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        login: { success: false },
        accessToken: null,
        expiresAt: null,
        bootstrapStatus: 'needsSignIn',
      };

    default:
      return state;
  }
}; 