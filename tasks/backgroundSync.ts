/**
 * Background Sync Task
 * 
 * Registers a background task that periodically syncs data when the app is not in foreground.
 * 
 * iOS: Best-effort only. iOS decides when to run background tasks based on battery,
 * network conditions, and user app usage patterns.
 * 
 * Android: Uses WorkManager which respects the minimum interval more closely.
 */
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {
  BACKGROUND_SYNC_TASK_NAME,
  SYNC_BACKGROUND_INTERVAL_SECONDS,
} from '../config/sync';

/**
 * Define the background task.
 * IMPORTANT: This must be called at module load time (outside of React components).
 */
TaskManager.defineTask(BACKGROUND_SYNC_TASK_NAME, async () => {
  console.log('[BackgroundSync] Task started');
  
  try {
    // Import SyncManager lazily to avoid circular dependencies
    const SyncManager = require('../services/SyncManager').default;
    
    // Check if we're authenticated before syncing
    // (SyncManager will short-circuit if offline anyway)
    await SyncManager.manualSync();
    
    console.log('[BackgroundSync] Task completed successfully');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[BackgroundSync] Task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register the background sync task.
 * Call this once during app initialization (e.g., in Loading screen after auth bootstrap).
 */
export const registerBackgroundSync = async (): Promise<void> => {
  try {
    // Check if already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK_NAME);
    
    if (isRegistered) {
      console.log('[BackgroundSync] Task already registered');
      return;
    }

    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK_NAME, {
      minimumInterval: SYNC_BACKGROUND_INTERVAL_SECONDS,
      stopOnTerminate: false, // Android: Keep task registered after app termination
      startOnBoot: true, // Android: Register task on device boot
    });

    console.log('[BackgroundSync] Task registered successfully');
  } catch (error) {
    console.error('[BackgroundSync] Failed to register task:', error);
    // Don't throw - background sync is best-effort
  }
};

/**
 * Unregister the background sync task.
 * Call this on logout if you want to stop background sync for logged-out users.
 */
export const unregisterBackgroundSync = async (): Promise<void> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK_NAME);
    
    if (!isRegistered) {
      console.log('[BackgroundSync] Task not registered, nothing to unregister');
      return;
    }

    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK_NAME);
    console.log('[BackgroundSync] Task unregistered successfully');
  } catch (error) {
    console.error('[BackgroundSync] Failed to unregister task:', error);
  }
};

/**
 * Get the status of background fetch for this device.
 * Useful for debugging or showing user info about background sync availability.
 */
export const getBackgroundSyncStatus = async (): Promise<BackgroundFetch.BackgroundFetchStatus> => {
  return await BackgroundFetch.getStatusAsync();
};

