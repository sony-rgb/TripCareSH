import * as actionTypes from './actionTypes';
import SyncManager from '../services/SyncManager';
import { checkApiHealth } from './connectivity';
import type { AuthBootstrapStatus } from '../reducers/auth';
import AuthService from '../services/AuthService';

interface LoginData {
  success: boolean;
}

interface LoginAction {
  type: string;
  data: LoginData;
}

const onLogin = (data: LoginData): LoginAction => {
  return {
    type: actionTypes.LOGIN,
    data,
  };
};

const onLogout = (): LoginAction => {
  return {
    type: actionTypes.LOGOUT,
    data: { success: false },
  };
};

/**
 * Set Auth Token Action
 * Stores the authentication token and its expiry time
 * 
 * @param token - The JWT or auth token
 * @param expiresAt - Unix timestamp (in milliseconds) when token expires
 */
export const setAuthToken = (token: string, expiresAt: number) => ({
  type: actionTypes.SET_AUTH_TOKEN,
  payload: { token, expiresAt },
});

/**
 * Set Bootstrap Status Action
 * Updates the current bootstrap status
 * 
 * @param status - The bootstrap status
 */
export const setBootstrapStatus = (status: AuthBootstrapStatus) => ({
  type: actionTypes.SET_BOOTSTRAP_STATUS,
  payload: { status },
});

/**
 * Authentication Thunk (Enhanced)
 * 
 * This is your existing sign-in flow. You should integrate it with setAuthToken
 * after receiving the token from your API.
 * 
 * Example integration after API call:
 *   const response = await api.signIn(email, password);
 *   dispatch(setAuthToken(response.token, response.expiresAt));
 *   dispatch(onLogin({ success: true }));
 */
export const authentication = (login: boolean, callback?: (data: {success: boolean}) => void) => (dispatch: any) => {
  //call api and dispatch action case
  setTimeout(() => {
    let data: LoginData = {
      success: login,
    };
    dispatch(onLogin(data));
    
    // TODO: After successful API login, also call:
    // dispatch(setAuthToken(apiResponse.token, apiResponse.expiresAt));
    
    // Start sync timer on successful login
    if (login) {
      SyncManager.start();
    }
    
    if (typeof callback === 'function') {
      callback({success: true});
    }
  }, 500);
};

/**
 * Logout Thunk (Enhanced)
 * Clears authentication state and resets connectivity
 */
export const logout = (callback?: () => void) => (dispatch: any) => {
  // Stop sync timer on logout
  SyncManager.stop();
  
  // Clear authentication state
  dispatch(onLogout());
  if (typeof callback === 'function') {
    callback();
  }
};

/**
 * Bootstrap Auth and Navigation Thunk
 * 
 * This is the core logic that runs on app startup and determines
 * whether the user should see the sign-in screen or the main app.
 * 
 * Decision Logic:
 * 1. No token → Check API connectivity
 *    - If API reachable → Navigate to SignIn
 *    - If API unreachable → Show "must be online to sign in"
 * 
 * 2. Token exists & NOT expired → Treat as logged in, navigate to Main
 * 
 * 3. Token exists & expired → Check API connectivity
 *    - If API unreachable → Allow offline access (don't prompt for sign-in)
 *    - If API reachable → Prompt for sign-in
 * 
 * @returns Promise<AuthBootstrapStatus>
 */
export const bootstrapAuthAndNavigation = () => async (dispatch: any, getState: any): Promise<AuthBootstrapStatus> => {
  try {
    dispatch(setBootstrapStatus('checking'));

    const state = getState();
    let { accessToken, expiresAt } = state.auth;

    const now = Date.now();

    console.log('[Bootstrap] Redux auth state:', {
      hasToken: !!accessToken,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      now: new Date(now).toISOString(),
      isExpired: expiresAt ? now >= expiresAt : null,
    });

    // MIGRATION PATH: If no token in Redux, try loading from AuthService (old storage)
    if (!accessToken || !expiresAt) {
      console.log('[Bootstrap] No token in Redux, checking AuthService storage...');
      try {
        const authToken = await AuthService.getAccessToken();
        
        if (authToken) {
          console.log('[Bootstrap] Found token in AuthService, migrating to Redux');
          // @ts-ignore - accessing private property for migration
          const tokens = (AuthService as any).tokens;
          if (tokens?.expiresAt) {
            const expiresAtMs = new Date(tokens.expiresAt).getTime();
            dispatch(setAuthToken(authToken, expiresAtMs));
            
            // Update local variables for this bootstrap run
            accessToken = authToken;
            expiresAt = expiresAtMs;
            
            console.log('[Bootstrap] Migrated token to Redux:', {
              hasToken: true,
              expiresAt: new Date(expiresAtMs).toISOString(),
            });
          }
        }
      } catch (error) {
        console.log('[Bootstrap] AuthService migration failed:', error);
      }
    }

    // Case 1: No token exists (even after checking AuthService)
    if (!accessToken || !expiresAt) {
      console.log('[Bootstrap] No token found - user has never signed in');
      
      // Check if API is reachable
      const isApiReachable = await dispatch(checkApiHealth());
      console.log('[Bootstrap] API reachable:', isApiReachable);

      if (isApiReachable) {
        // API is reachable, user can sign in
        console.log('[Bootstrap] → Navigating to SignIn (no token, API reachable)');
        dispatch(setBootstrapStatus('needsSignIn'));
        return 'needsSignIn';
      } else {
        // API is not reachable, must be online to sign in
        console.log('[Bootstrap] → Navigating to RequiresOnline (no token, API unreachable)');
        dispatch(setBootstrapStatus('needsOnlineToSignIn'));
        return 'needsOnlineToSignIn';
      }
    }

    // Case 2: Token exists and is NOT expired
    const isTokenExpired = now >= expiresAt;
    
    if (!isTokenExpired) {
      console.log('[Bootstrap] ✓ Valid token found, user is authenticated');
      console.log('[Bootstrap] Token expires:', new Date(expiresAt).toISOString());
      
      // Token is valid, treat user as logged in
      dispatch(onLogin({ success: true }));
      
      // Optionally check API connectivity in background (non-blocking)
      dispatch(checkApiHealth()).then((isReachable) => {
        console.log('[Bootstrap] Background connectivity check:', isReachable ? 'online' : 'offline');
        if (isReachable) {
          dispatch(setBootstrapStatus('authenticatedOnline'));
        } else {
          dispatch(setBootstrapStatus('authenticatedOffline'));
        }
      });

      // Return immediately with authenticated status
      console.log('[Bootstrap] → Navigating to Main (valid token)');
      return 'authenticatedOnline';
    }

    // Case 3: Token exists but is expired
    console.log('[Bootstrap] ⚠ Token expired, checking API connectivity');
    console.log('[Bootstrap] Token expired at:', new Date(expiresAt).toISOString());
    
    const isApiReachable = await dispatch(checkApiHealth());
    console.log('[Bootstrap] API reachable:', isApiReachable);

    if (!isApiReachable) {
      // API not reachable: Allow offline access (don't prompt for sign-in)
      console.log('[Bootstrap] → Navigating to Main (expired token, offline - grace period)');
      dispatch(onLogin({ success: true }));
      dispatch(setBootstrapStatus('authenticatedOffline'));
      return 'authenticatedOffline';
    } else {
      // API is reachable: Prompt for sign-in
      console.log('[Bootstrap] → Navigating to SignIn (expired token, API reachable)');
      dispatch(setBootstrapStatus('needsSignIn'));
      return 'needsSignIn';
    }
  } catch (error) {
    console.error('[Bootstrap] Error during bootstrap:', error);
    dispatch(setBootstrapStatus('needsSignIn'));
    return 'needsSignIn';
  }
}; 