# Local Database Schema Restoration

## Issue
The local WatermelonDB schema was consolidated in version 8, merging `flights` and `activity_items` tables into `trip_items`. However, the Flight and ActivityItem models still existed, causing a mismatch between models and schema.

## Solution
Reverted to separate tables architecture to match:
1. The server-side PostgreSQL schema
2. The existing Flight.ts and ActivityItem.ts models

## Changes Made

### 1. Schema Updated (Version 8 → 9)
**File**: `src/app/database/schema.ts`

**Changes**:
- Bumped version from 8 to 9
- Removed flight/activity-specific columns from `trip_items`
- Added `flights` table definition (matching Flight model)
- Added `activity_items` table definition (matching ActivityItem model)

**Tables Now**:
- `trips` - Trip information
- `trip_items` - Generic trip item container (no flight/activity fields)
- `flights` - Flight-specific data (references `trip_item_id`)
- `activity_items` - Activity-specific data (references `trip_item_id`)
- `users` - User information

### 2. Migration Added (To Version 9)
**File**: `src/app/database/migrations.ts`

**Steps**:
1. `createTable` - Recreate `flights` table with all flight fields
2. `createTable` - Recreate `activity_items` table with all activity fields
3. `unsafeExecuteSql` - Migrate flight data FROM `trip_items` (where type='flight') TO `flights`
4. `unsafeExecuteSql` - Migrate activity data FROM `trip_items` (where type='activity') TO `activity_items`

**Data Migration Logic**:
```sql
-- Flights: Extract from trip_items where type='flight'
INSERT INTO flights (...) 
SELECT ... FROM trip_items WHERE type = 'flight' AND airline IS NOT NULL

-- Activities: Extract from trip_items where type='activity'
INSERT INTO activity_items (...) 
SELECT ... FROM trip_items WHERE type = 'activity' AND title IS NOT NULL
```

### 3. Database Init Updated
**File**: `src/app/database/init.ts`

**Changes**:
- Imported `Flight` and `ActivityItem` models
- Added them to `modelClasses` array
- Added initialization logic for `flights` table (creates temp record to force table creation)
- Added initialization logic for `activity_items` table (creates temp record to force table creation)

## Table Schemas

### Flights Table
```typescript
{
  name: 'flights',
  columns: [
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'trip_item_id', type: 'string', isIndexed: true },
    { name: 'airline', type: 'string' },
    { name: 'flight_number', type: 'string' },
    { name: 'departure_airport', type: 'string' },
    { name: 'arrival_airport', type: 'string' },
    { name: 'departure_time_local', type: 'number' },
    { name: 'departure_time_utc', type: 'number' },
    { name: 'arrival_time_local', type: 'number' },
    { name: 'arrival_time_utc', type: 'number' },
    { name: 'confirmation_number', type: 'string', isOptional: true },
    { name: 'notes', type: 'string', isOptional: true },
    { name: 'created_at_utc', type: 'number' },
    { name: 'updated_at_utc', type: 'number' },
    { name: 'sync_status', type: 'string' },
    { name: 'sync_changed', type: 'string' },
  ]
}
```

### Activity Items Table
```typescript
{
  name: 'activity_items',
  columns: [
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'trip_item_id', type: 'string', isIndexed: true },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string', isOptional: true },
    { name: 'venue', type: 'string', isOptional: true },
    { name: 'address', type: 'string', isOptional: true },
    { name: 'start_date', type: 'number' },
    { name: 'start_time', type: 'string', isOptional: true },
    { name: 'end_date', type: 'number', isOptional: true },
    { name: 'end_time', type: 'string', isOptional: true },
    { name: 'is_completed', type: 'boolean', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'sync_status', type: 'string' },
    { name: 'sync_changed', type: 'string' },
  ]
}
```

## Migration History

**V7** → Added `user_id` to all tables (trips, trip_items, flights, activity_items)

**V8** → Consolidated flights and activity_items INTO trip_items, then dropped separate tables

**V9** → Reverted - Recreated flights and activity_items tables FROM trip_items data

## Testing

After restarting the app, you should see:

1. **Schema migration runs** - Console shows migration to version 9
2. **Tables created** - Console logs show:
   ```
   ✅ Created trips table
   ✅ Created trip_items table
   ✅ Created flights table
   ✅ Created activity_items table
   ✅ Users table available
   ✅ Database initialization complete
   ```
3. **Data preserved** - Any existing flight/activity data in trip_items is migrated to separate tables

## Verify in Database

To verify the tables exist, you can use a React Native SQLite viewer or add this debug code:

```typescript
import database from './database/init'

// Check tables
const checkTables = async () => {
  try {
    const flights = await database.get('flights').query().fetch()
    const activities = await database.get('activity_items').query().fetch()
    console.log(`Flights: ${flights.length}, Activities: ${activities.length}`)
  } catch (error) {
    console.error('Error checking tables:', error)
  }
}
```

## Architecture Alignment

**Local (WatermelonDB)** ↔️ **Server (PostgreSQL)**

```
trips                 ↔️  tripcare.trips
trip_items            ↔️  tripcare.trip_items
flights               ↔️  tripcare.flights
activity_items        ↔️  tripcare.activity_items
users                 ↔️  tripcare.users
```

Both sides now use the **same architecture** with separate tables for flights and activities!

## Next Steps

1. **Restart the app** - The migration will run automatically
2. **Check console logs** - Verify tables are created
3. **Test sync** - Create a flight/activity and sync to server
4. **Verify data** - Check that data flows correctly between local and server databases

## Important Notes

- The migration preserves existing data by extracting flights/activities from trip_items
- Trip items with `type='flight'` are migrated to the `flights` table
- Trip items with `type='activity'` are migrated to the `activity_items` table
- Generic trip items (lodging, transportation, etc.) remain in `trip_items`
- The migration is **irreversible** without manual intervention

