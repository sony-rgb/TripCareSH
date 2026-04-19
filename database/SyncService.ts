import { synchronize } from '@nozbe/watermelondb/sync'
import database from './init'
import { API_BASE_URL } from '../appConfig'
import { ISyncService } from '../services/interfaces/ISyncService'
import { IAuthService } from '../services/interfaces/IAuthService'

/**
 * SyncService handles bidirectional sync with the server.
 * 
 * Security:
 * - User is authenticated via JWT access token
 * - Server uses user_id from JWT for data isolation
 * - No additional client key needed
 */
export class SyncService implements ISyncService {
  private authService: IAuthService;
  private lastSyncAt: number | null = null;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  /**
   * Get the timestamp of the last successful sync.
   * Note: SyncManager also tracks this at a higher level for debouncing/staleness checks.
   */
  getLastSyncAt(): number | null {
    return this.lastSyncAt;
  }

  async sync() {
    try {
      const accessToken = await this.authService.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token found');
      }

      await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/v1/sync/pull`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ lastPulledAt }),
            })

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Pull sync failed:', errorText);
              // Return empty changes instead of throwing - allows push to still work
              console.warn('Continuing with push even though pull failed');
              return { 
                changes: {
                  trips: { created: [], updated: [], deleted: [] },
                  trip_items: { created: [], updated: [], deleted: [] }
                }, 
                timestamp: Date.now() 
              }
            }

            const { changes, timestamp } = await response.json()
            console.log('📥 Pull sync received changes:', {
              trips: changes.trips ? Object.keys(changes.trips).reduce((acc, key) => ({ ...acc, [key]: changes.trips[key].length }), {}) : 'none',
              trip_items: changes.trip_items ? Object.keys(changes.trip_items).reduce((acc, key) => ({ ...acc, [key]: changes.trip_items[key].length }), {}) : 'none'
            });
            return { changes, timestamp }
          } catch (error) {
            console.error('Pull sync error:', error);
            // Return empty changes to allow push to proceed
            console.warn('Continuing with push even though pull failed');
            return { 
              changes: {
                trips: { created: [], updated: [], deleted: [] },
                trip_items: { created: [], updated: [], deleted: [] }
              }, 
              timestamp: Date.now() 
            }
          }
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
          try {
            // SECURITY: Filter out 'users' table - users are managed by auth system, not sync
            // The server does not accept user changes through the sync endpoint
            const filteredChanges = { ...changes };
            if (filteredChanges.users) {
              console.warn('⚠️ Removing users table from sync (users are managed by auth system)');
              delete filteredChanges.users;
            }
            
            // Log what we're about to push
            console.log('📤 Push sync preparing changes:', {
              trips: filteredChanges.trips ? Object.keys(filteredChanges.trips).reduce((acc, key) => ({ ...acc, [key]: filteredChanges.trips[key].length }), {}) : 'none',
              trip_items: filteredChanges.trip_items ? Object.keys(filteredChanges.trip_items).reduce((acc, key) => ({ ...acc, [key]: filteredChanges.trip_items[key].length }), {}) : 'none',
              flights: filteredChanges.flights ? Object.keys(filteredChanges.flights).reduce((acc, key) => ({ ...acc, [key]: filteredChanges.flights[key].length }), {}) : 'none',
              activity_items: filteredChanges.activity_items ? Object.keys(filteredChanges.activity_items).reduce((acc, key) => ({ ...acc, [key]: filteredChanges.activity_items[key].length }), {}) : 'none',
            });
            
            // DIAGNOSTIC: Check if flights in "updated" array are actually deleted
            if (filteredChanges.flights?.updated && filteredChanges.flights.updated.length > 0) {
              const firstUpdated = filteredChanges.flights.updated[0];
              console.log('📤 Sample "updated" flight:', {
                id: firstUpdated.id,
                _status: firstUpdated._status,
                isDeleted: firstUpdated._status === 'deleted',
                hasData: !!firstUpdated.airline
              });
            }
            
            // DIAGNOSTIC: Check if flights in "created" array are actually deleted
            if (filteredChanges.flights?.created && filteredChanges.flights.created.length > 0) {
              const firstCreated = filteredChanges.flights.created[0];
              console.log('📤 Sample "created" flight:', {
                id: firstCreated.id,
                _status: firstCreated._status,
                isDeleted: firstCreated._status === 'deleted',
                hasData: !!firstCreated.airline
              });
            }
            
            // Sanitize changes to ensure JSON serialization works
            let sanitizedChanges;
            try {
              const jsonString = JSON.stringify(filteredChanges, (key, value) => {
                // Replace any non-serializable values
                if (value === undefined) return null;
                if (typeof value === 'number' && !isFinite(value)) return null;
                return value;
              });
              console.log('📤 Intermediate JSON string length:', jsonString.length);
              sanitizedChanges = JSON.parse(jsonString);
              console.log('📤 Sanitization successful, changes object recreated');
            } catch (sanitizeError) {
              console.error('❌ Error during sanitization:', sanitizeError);
              console.error('Original changes keys:', Object.keys(filteredChanges));
              throw new Error(`Failed to sanitize changes: ${sanitizeError.message}`);
            }
            
            console.log('📤 Sanitized changes prepared, filtering and transforming records...');
            
            // Validate the structure is what the server expects
            if (typeof sanitizedChanges !== 'object' || sanitizedChanges === null) {
              throw new Error('Sanitized changes is not an object');
            }
            
            // FILTER OUT soft-deleted records from created/updated arrays
            // These should ONLY be in the "deleted" array
            for (const [tableName, tableChanges] of Object.entries(sanitizedChanges)) {
              if (tableChanges && typeof tableChanges === 'object') {
                // Filter created array
                if (Array.isArray(tableChanges.created)) {
                  const beforeCount = tableChanges.created.length;
                  tableChanges.created = tableChanges.created.filter((record: any) => record._status !== 'deleted');
                  const afterCount = tableChanges.created.length;
                  if (beforeCount !== afterCount) {
                    console.log(`📤 Filtered ${beforeCount - afterCount} soft-deleted records from ${tableName} "created" array`);
                  }
                }
                
                // Filter updated array
                if (Array.isArray(tableChanges.updated)) {
                  const beforeCount = tableChanges.updated.length;
                  tableChanges.updated = tableChanges.updated.filter((record: any) => record._status !== 'deleted');
                  const afterCount = tableChanges.updated.length;
                  if (beforeCount !== afterCount) {
                    console.log(`📤 Filtered ${beforeCount - afterCount} soft-deleted records from ${tableName} "updated" array`);
                  }
                }
              }
            }
            
            // TRANSFORM deleted arrays: Server expects objects [{"id": "123"}], not strings ["123"]
            // WatermelonDB sends deleted as strings, but Spring Boot expects Map<String, Object>
            for (const [tableName, tableChanges] of Object.entries(sanitizedChanges)) {
              if (tableChanges && typeof tableChanges === 'object' && 'deleted' in tableChanges) {
                const deleted = tableChanges.deleted;
                if (Array.isArray(deleted) && deleted.length > 0) {
                  // Check if first item is a string (not an object)
                  if (typeof deleted[0] === 'string') {
                    console.log(`📤 Transforming ${deleted.length} deleted IDs to objects for ${tableName}`);
                    // Convert ["id1", "id2"] to [{"id": "id1"}, {"id": "id2"}]
                    tableChanges.deleted = deleted.map((id: string) => ({ id }));
                  }
                }
              }
            }
            
            // Create the request body
            const requestBody = { 
              changes: sanitizedChanges, 
              lastPulledAt: lastPulledAt || null 
            };
            
            // Log a sample of what we're sending
            console.log('📤 Sample of request body:', {
              hasChanges: !!requestBody.changes,
              changesKeys: requestBody.changes ? Object.keys(requestBody.changes) : [],
              lastPulledAt: requestBody.lastPulledAt,
            });
            
            // For each table in changes, log the structure
            if (requestBody.changes) {
              for (const [table, tableChanges] of Object.entries(requestBody.changes)) {
                if (tableChanges && typeof tableChanges === 'object') {
                  const deletedSample = Array.isArray(tableChanges.deleted) && tableChanges.deleted.length > 0 
                    ? tableChanges.deleted[0] 
                    : 'none';
                  console.log(`📤   ${table}:`, {
                    created: Array.isArray(tableChanges.created) ? tableChanges.created.length : 'invalid',
                    updated: Array.isArray(tableChanges.updated) ? tableChanges.updated.length : 'invalid',
                    deleted: Array.isArray(tableChanges.deleted) ? tableChanges.deleted.length : 'invalid',
                    deletedFormat: typeof deletedSample === 'object' ? 'object ✓' : typeof deletedSample,
                  });
                }
              }
            }
            
            // Stringify and validate
            let bodyString;
            try {
              bodyString = JSON.stringify(requestBody);
              console.log('📤 Request body size:', bodyString.length, 'bytes');
              console.log('📤 Request body preview (first 500 chars):', bodyString.substring(0, 500));
              
              // Validate it can be parsed back
              JSON.parse(bodyString);
              console.log('📤 Request body is valid JSON, sending to server...');
            } catch (stringifyError) {
              console.error('❌ Error stringifying request body:', stringifyError);
              throw new Error(`Cannot create request body: ${stringifyError.message}`);
            }
            
            const response = await fetch(`${API_BASE_URL}/api/v1/sync/push`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: bodyString,
            })

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Push sync failed:', errorText);
              throw new Error(`Failed to push changes: ${response.status}`)
            }

            const result = await response.json();
            
            // Server now processes synchronously, so status should be 'completed'
            if (result.status === 'completed') {
              console.log('✅ Push completed successfully:', result.message);
            } else if (result.status === 'failed') {
              console.error('❌ Push failed:', result.message);
              throw new Error(result.message);
            }
          } catch (error) {
            if (error instanceof TypeError && error.message.includes('circular')) {
              console.error('❌ Circular reference detected in changes:', error);
              console.error('Changes object keys:', Object.keys(changes));
              throw new Error('Cannot serialize changes: circular reference detected');
            } else if (error instanceof SyntaxError) {
              console.error('❌ JSON serialization error:', error);
              console.error('Changes:', changes);
              throw new Error('Cannot serialize changes to JSON');
            }
            throw error;
          }
        },
      })
      
      // Update last sync timestamp on success
      this.lastSyncAt = Date.now();
    } catch (error) {
      console.error('Sync failed:', error)
      throw error
    }
  }

  /**
   * Push-only sync for testing purposes.
   * Uses WatermelonDB's synchronize but with a no-op pull to test push independently.
   */
  async pushOnly() {
    try {
      const accessToken = await this.authService.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token found');
      }

      await synchronize({
        database,
        // No-op pull - just return empty changes immediately
        pullChanges: async () => {
          console.log('⏭️  Skipping pull for push-only test');
          return { 
            changes: {
              trips: { created: [], updated: [], deleted: [] },
              trip_items: { created: [], updated: [], deleted: [] }
            }, 
            timestamp: Date.now() 
          }
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
          console.log('📤 Pushing changes to server...', Object.keys(changes));
          
          const response = await fetch(`${API_BASE_URL}/api/v1/sync/push`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ changes, lastPulledAt }),
          })

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Push sync failed:', errorText);
            throw new Error(`Failed to push changes: ${response.status}`)
          }

          const result = await response.json();
          
          // If sync is async (status: pending), we could poll for status
          if (result.status === 'pending') {
            console.log('✅ Push queued for processing:', result.syncStatusId);
          } else {
            console.log('✅ Push completed:', result);
          }
        },
      })
      
      return { status: 'success', message: 'Push completed successfully' };
    } catch (error) {
      console.error('Push-only sync failed:', error)
      throw error
    }
  }
}
