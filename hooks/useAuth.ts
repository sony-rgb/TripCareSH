import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { bootstrapAuthAndNavigation } from '../actions/auth';
import type { AuthBootstrapStatus, AuthState } from '../reducers/auth';

/**
 * Root State Type
 */
interface RootState {
  auth: AuthState;
  connectivity: any;
  application: any;
  trips: any;
}

/**
 * Selector: Select Auth State
 */
export const selectAuthState = (state: RootState): AuthState => {
  return state.auth;
};

/**
 * Selector: Select Bootstrap Status
 */
export const selectBootstrapStatus = (state: RootState): AuthBootstrapStatus => {
  return state.auth.bootstrapStatus;
};

/**
 * Selector: Select if User is Authenticated
 */
export const selectIsAuthenticated = (state: RootState): boolean => {
  return state.auth.login.success;
};

/**
 * Selector: Select Auth Token
 */
export const selectAuthToken = (state: RootState): string | null => {
  return state.auth.accessToken;
};

/**
 * Selector: Check if Token is Expired
 */
export const selectIsTokenExpired = (state: RootState): boolean => {
  const { expiresAt } = state.auth;
  if (!expiresAt) return true;
  return Date.now() >= expiresAt;
};

/**
 * Hook: useBootstrapStatus
 * 
 * Returns the current bootstrap status
 * 
 * @returns AuthBootstrapStatus
 */
export const useBootstrapStatus = (): AuthBootstrapStatus => {
  return useSelector(selectBootstrapStatus);
};

/**
 * Hook: useIsAuthenticated
 * 
 * Returns whether the user is currently authenticated
 * 
 * @returns boolean
 */
export const useIsAuthenticated = (): boolean => {
  return useSelector(selectIsAuthenticated);
};

/**
 * Hook: useAuthBootstrap
 * 
 * This hook performs the auth bootstrap process on mount.
 * It determines whether the user should be shown the sign-in screen
 * or the main app based on token validity and API connectivity.
 * 
 * IMPORTANT: This hook waits for redux-persist to rehydrate before
 * running the bootstrap logic. This ensures the persisted auth token
 * is available before making decisions.
 * 
 * Usage: Call this at the root level (App.tsx or similar)
 * 
 * @returns Object with bootstrap status and loading state
 * 
 * Example:
 *   const { bootstrapStatus, isBootstrapping } = useAuthBootstrap();
 *   
 *   if (isBootstrapping) {
 *     return <SplashScreen />;
 *   }
 *   
 *   if (bootstrapStatus === 'needsSignIn') {
 *     return <SignInScreen />;
 *   }
 *   
 *   return <MainApp />;
 */
export const useAuthBootstrap = () => {
  const dispatch = useDispatch();
  const bootstrapStatus = useBootstrapStatus();
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  
  // Check if redux-persist has rehydrated
  const authState = useSelector(selectAuthState);
  const persistRehydrated = useSelector((state: RootState) => {
    // @ts-ignore - _persist is added by redux-persist
    return state._persist?.rehydrated ?? false;
  });

  useEffect(() => {
    // Wait for redux-persist to rehydrate before bootstrapping
    if (!persistRehydrated) {
      console.log('[useAuthBootstrap] Waiting for redux-persist to rehydrate...');
      return;
    }

    const performBootstrap = async () => {
      console.log('[useAuthBootstrap] Redux rehydrated, starting bootstrap');
      console.log('[useAuthBootstrap] Current auth state:', {
        hasToken: !!authState.accessToken,
        expiresAt: authState.expiresAt,
        isLoggedIn: authState.login.success,
      });
      
      setIsBootstrapping(true);
      
      try {
        await dispatch(bootstrapAuthAndNavigation() as any);
      } catch (error) {
        console.error('[useAuthBootstrap] Bootstrap failed:', error);
      } finally {
        setIsBootstrapping(false);
        console.log('[useAuthBootstrap] Bootstrap complete');
      }
    };

    performBootstrap();
  }, [dispatch, persistRehydrated, authState.accessToken]);

  return {
    bootstrapStatus,
    isBootstrapping: isBootstrapping || !persistRehydrated,
  };
};

