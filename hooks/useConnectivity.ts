import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, useRef } from 'react';
import { checkApiHealth } from '../actions/connectivity';
import { CONNECTIVITY_CHECK_INTERVAL } from '../config/api';
import type { ConnectivityState } from '../reducers/connectivity';
import SyncManager from '../services/SyncManager';

/**
 * Root State Type
 * Add your other reducers as needed
 */
interface RootState {
  connectivity: ConnectivityState;
  auth: any;
  application: any;
  trips: any;
}

/**
 * Selector: Select API Reachability Status
 * 
 * @param state - Redux root state
 * @returns boolean | null - true if API is reachable, false if not, null if unknown
 */
export const selectIsApiReachable = (state: RootState): boolean | null => {
  return state.connectivity.apiReachable;
};

/**
 * Selector: Select Connectivity State
 * 
 * @param state - Redux root state
 * @returns ConnectivityState - The full connectivity state
 */
export const selectConnectivityState = (state: RootState): ConnectivityState => {
  return state.connectivity;
};

/**
 * Hook: useIsApiReachable
 * 
 * Simple hook to check if the API is currently reachable.
 * 
 * @returns boolean | null - true if API is reachable, false if not, null if unknown
 * 
 * Example usage:
 *   const isApiReachable = useIsApiReachable();
 *   
 *   if (isApiReachable === false) {
 *     return <Text>You're offline. Some features may not work.</Text>;
 *   }
 */
export const useIsApiReachable = (): boolean | null => {
  return useSelector(selectIsApiReachable);
};

/**
 * Hook: useConnectivity
 * 
 * Comprehensive hook that provides connectivity state and methods.
 * 
 * @returns Object with connectivity state and check method
 * 
 * Example usage:
 *   const { isReachable, checking, lastCheckedAt, checkNow } = useConnectivity();
 *   
 *   return (
 *     <View>
 *       <Text>API Status: {isReachable ? 'Online' : 'Offline'}</Text>
 *       <Button onPress={checkNow}>Check Now</Button>
 *     </View>
 *   );
 */
export const useConnectivity = () => {
  const dispatch = useDispatch();
  const connectivity = useSelector(selectConnectivityState);

  const checkNow = useCallback(() => {
    dispatch(checkApiHealth() as any);
  }, [dispatch]);

  return {
    isReachable: connectivity.apiReachable,
    checking: connectivity.checking,
    lastCheckedAt: connectivity.lastCheckedAt,
    error: connectivity.error,
    checkNow,
  };
};

/**
 * Hook: useGlobalConnectivity
 * 
 * This hook should be used at the root level of your app (e.g., in App.tsx or a provider).
 * It automatically checks API connectivity on mount and periodically thereafter.
 * 
 * Features:
 * - Checks connectivity on mount
 * - Periodic checks based on CONNECTIVITY_CHECK_INTERVAL
 * - Cleanup on unmount
 * 
 * Example usage in App.tsx:
 *   function App() {
 *     useGlobalConnectivity();
 *     return <NavigationContainer>...</NavigationContainer>;
 *   }
 */
export const useGlobalConnectivity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial check on mount
    console.log('[useGlobalConnectivity] Performing initial connectivity check');
    dispatch(checkApiHealth() as any);

    // Set up periodic checks
    const intervalId = setInterval(() => {
      console.log('[useGlobalConnectivity] Performing periodic connectivity check');
      dispatch(checkApiHealth() as any);
    }, CONNECTIVITY_CHECK_INTERVAL);

    // Cleanup on unmount
    return () => {
      console.log('[useGlobalConnectivity] Cleaning up periodic checks');
      clearInterval(intervalId);
    };
  }, [dispatch]);
};

/**
 * Hook: useSyncOnReconnect
 * 
 * Triggers a sync when connectivity transitions from offline to online.
 * Should be used alongside useGlobalConnectivity at the root level.
 * 
 * Example usage in App.tsx or Loading screen:
 *   function App() {
 *     useGlobalConnectivity();
 *     useSyncOnReconnect();
 *     return <NavigationContainer>...</NavigationContainer>;
 *   }
 */
export const useSyncOnReconnect = () => {
  const prevReachable = useRef<boolean | null>(null);
  const { isReachable } = useConnectivity();

  useEffect(() => {
    // Detect offline → online transition
    if (prevReachable.current === false && isReachable === true) {
      console.log('[useSyncOnReconnect] Reconnected! Triggering sync...');
      SyncManager.manualSync().catch((error) => {
        console.error('[useSyncOnReconnect] Sync on reconnect failed:', error);
      });
    }

    // Update previous state
    prevReachable.current = isReachable;
  }, [isReachable]);
};
