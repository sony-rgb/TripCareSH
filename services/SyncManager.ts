import { container } from './container';
import { ISyncService } from './interfaces/ISyncService';
import NetInfo from '@react-native-community/netinfo';
import {
  SYNC_DEBOUNCE_MS,
  SYNC_FOREGROUND_INTERVAL_MS,
  SYNC_STALE_THRESHOLD_MINUTES,
  SYNC_DISABLED,
} from '../config/sync';

class SyncManager {
  private static instance: SyncManager;
  private syncInterval: NodeJS.Timeout | null = null;
  private syncService: ISyncService;

  // Mutex to prevent concurrent sync runs
  private isSyncing: boolean = false;

  // Track last successful sync time (app-level, not WatermelonDB's internal lastPulledAt)
  private lastSyncAt: number | null = null;

  // Debounce timer
  private debounceTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.syncService = container.getSyncService();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Start periodic syncing
   */
  start(): void {
    if (this.syncInterval) {
      console.log('SyncManager: Already running');
      return;
    }

    console.log('SyncManager: Starting sync timer');
    
    // Initial sync
    this.performSync();
    
    // Set up periodic interval
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, SYNC_FOREGROUND_INTERVAL_MS);
  }

  /**
   * Stop periodic syncing
   */
  stop(): void {
    if (this.syncInterval) {
      console.log('SyncManager: Stopping sync timer');
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  /**
   * Manually trigger sync (debounced)
   */
  async manualSync(): Promise<void> {
    return this.performSyncDebounced();
  }

  /**
   * Sync if the last sync is older than the configured threshold
   */
  async syncIfStale(): Promise<void> {
    const now = Date.now();
    const thresholdMs = SYNC_STALE_THRESHOLD_MINUTES * 60 * 1000;

    if (this.lastSyncAt === null || now - this.lastSyncAt > thresholdMs) {
      console.log('SyncManager: Sync is stale, triggering sync');
      await this.performSyncDebounced();
    } else {
      console.log('SyncManager: Sync is fresh, skipping');
    }
  }

  /**
   * Get the timestamp of the last successful sync
   */
  getLastSyncAt(): number | null {
    return this.lastSyncAt;
  }

  /**
   * Check if periodic sync is running
   */
  isRunning(): boolean {
    return this.syncInterval !== null;
  }

  /**
   * Check if a sync is currently in progress
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Debounced sync to prevent rapid fire triggers
   */
  private performSyncDebounced(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Clear existing debounce timer
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(async () => {
        try {
          await this.performSync();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, SYNC_DEBOUNCE_MS);
    });
  }

  /**
   * Core sync logic with mutex and connectivity check
   */
  private async performSync(): Promise<void> {
    if (SYNC_DISABLED) {
      console.log('SyncManager: Sync disabled by config');
      return;
    }

    // Check mutex - prevent concurrent syncs
    if (this.isSyncing) {
      console.log('SyncManager: Sync already in progress, skipping');
      return;
    }

    // Check connectivity first
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected || !netState.isInternetReachable) {
        console.log('SyncManager: Offline, skipping sync');
        return;
      }
    } catch (error) {
      console.warn('SyncManager: Could not determine connectivity, proceeding with sync attempt');
    }

    // Acquire mutex
    this.isSyncing = true;

    try {
      console.log('SyncManager: Starting sync...');
      await this.syncService.sync();
      
      // Update last sync timestamp on success
      this.lastSyncAt = Date.now();
      console.log('SyncManager: Sync completed successfully at', new Date(this.lastSyncAt).toISOString());
    } catch (error) {
      console.error('SyncManager: Sync failed:', error);
      throw error;
    } finally {
      // Release mutex
      this.isSyncing = false;
    }
  }
}

export default SyncManager.getInstance();
