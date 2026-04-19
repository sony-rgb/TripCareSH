import { addColumns, schemaMigrations, createTable, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 7,
      steps: [
        addColumns({
          table: 'trips',
          columns: [{ name: 'user_id', type: 'string', isIndexed: true }],
        }),
        addColumns({
          table: 'trip_items',
          columns: [{ name: 'user_id', type: 'string', isIndexed: true }],
        }),
        addColumns({
          table: 'flights',
          columns: [{ name: 'user_id', type: 'string', isIndexed: true }],
        }),
        addColumns({
          table: 'activity_items',
          columns: [{ name: 'user_id', type: 'string', isIndexed: true }],
        }),
      ],
    },
    {
      toVersion: 8,
      steps: [
        // Add new fields to trip_items to accommodate flight and activity data
        addColumns({
          table: 'trip_items',
          columns: [
            { name: 'description', type: 'string', isOptional: true },
            { name: 'location', type: 'string', isOptional: true },
            { name: 'booking_reference', type: 'string', isOptional: true },
            { name: 'notes', type: 'string', isOptional: true },
            { name: 'price', type: 'number', isOptional: true },
            // Flight fields
            { name: 'airline', type: 'string', isOptional: true },
            { name: 'flight_number', type: 'string', isOptional: true },
            { name: 'departure_airport', type: 'string', isOptional: true },
            { name: 'arrival_airport', type: 'string', isOptional: true },
            { name: 'departure_time_local', type: 'number', isOptional: true },
            { name: 'departure_time_utc', type: 'number', isOptional: true },
            { name: 'arrival_time_local', type: 'number', isOptional: true },
            { name: 'arrival_time_utc', type: 'number', isOptional: true },
            { name: 'confirmation_number', type: 'string', isOptional: true },
            // Activity fields
            { name: 'venue', type: 'string', isOptional: true },
            { name: 'address', type: 'string', isOptional: true },
            { name: 'start_time', type: 'string', isOptional: true },
            { name: 'end_time', type: 'string', isOptional: true },
            { name: 'is_completed', type: 'boolean', isOptional: true },
          ],
        }),
        // Migrate flight data to trip_items
        unsafeExecuteSql(`
          INSERT INTO trip_items (
            id, user_id, trip_id, type, title, start_date, end_date, status, icon,
            airline, flight_number, departure_airport, arrival_airport,
            departure_time_local, departure_time_utc, arrival_time_local, arrival_time_utc,
            confirmation_number, notes, created_at, updated_at, sync_status, sync_changed
          )
          SELECT 
            f.id, f.user_id, ti.trip_id, 'flight' as type,
            (f.airline || ' ' || f.flight_number) as title,
            f.departure_time_local as start_date,
            f.arrival_time_local as end_date,
            'Booked' as status,
            'plane' as icon,
            f.airline, f.flight_number, f.departure_airport, f.arrival_airport,
            f.departure_time_local, f.departure_time_utc, f.arrival_time_local, f.arrival_time_utc,
            f.confirmation_number, f.notes,
            f.created_at_utc as created_at,
            f.updated_at_utc as updated_at,
            f.sync_status, f.sync_changed
          FROM flights f
          LEFT JOIN trip_items ti ON ti.id = f.trip_item_id
          WHERE ti.id IS NOT NULL;
        `),
        // Migrate activity data to trip_items
        unsafeExecuteSql(`
          INSERT INTO trip_items (
            id, user_id, trip_id, type, title, description, start_date, end_date,
            status, icon, venue, address, start_time, end_time, is_completed,
            created_at, updated_at, sync_status, sync_changed
          )
          SELECT 
            a.id, a.user_id, ti.trip_id, 'activity' as type,
            a.title, a.description, a.start_date, a.end_date,
            CASE WHEN a.is_completed = 1 THEN 'Completed' ELSE 'Pending' END as status,
            'calendar' as icon,
            a.venue, a.address, a.start_time, a.end_time, a.is_completed,
            a.created_at, a.updated_at,
            a.sync_status, a.sync_changed
          FROM activity_items a
          LEFT JOIN trip_items ti ON ti.id = a.trip_item_id
          WHERE ti.id IS NOT NULL;
        `),
        // Drop old tables
        unsafeExecuteSql('DROP TABLE IF EXISTS flights;'),
        unsafeExecuteSql('DROP TABLE IF EXISTS activity_items;'),
      ],
    },
    {
      toVersion: 9,
      steps: [
        // Recreate flights table
        createTable({
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
          ],
        }),
        // Recreate activity_items table
        createTable({
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
          ],
        }),
        // Migrate flight data back from trip_items
        unsafeExecuteSql(`
          INSERT INTO flights (
            id, user_id, trip_item_id, airline, flight_number,
            departure_airport, arrival_airport, departure_time_local, departure_time_utc,
            arrival_time_local, arrival_time_utc, confirmation_number, notes,
            created_at_utc, updated_at_utc, sync_status, sync_changed
          )
          SELECT 
            id, user_id, trip_id as trip_item_id,
            airline, flight_number, departure_airport, arrival_airport,
            departure_time_local, departure_time_utc, arrival_time_local, arrival_time_utc,
            confirmation_number, notes, created_at, updated_at, sync_status, sync_changed
          FROM trip_items
          WHERE type = 'flight'
            AND airline IS NOT NULL
            AND flight_number IS NOT NULL;
        `),
        // Migrate activity data back from trip_items
        unsafeExecuteSql(`
          INSERT INTO activity_items (
            id, user_id, trip_item_id, title, description, venue, address,
            start_date, start_time, end_date, end_time, is_completed,
            created_at, updated_at, sync_status, sync_changed
          )
          SELECT 
            id, user_id, trip_id as trip_item_id,
            title, description, venue, address, start_date, start_time,
            end_date, end_time, is_completed, created_at, updated_at,
            sync_status, sync_changed
          FROM trip_items
          WHERE type = 'activity'
            AND (venue IS NOT NULL OR title IS NOT NULL);
        `),
        // Remove flight-specific columns from trip_items (optional - keeps data clean)
        // Note: SQLite doesn't support DROP COLUMN, so we keep them but they'll be null for non-consolidated items
      ],
    },
  ],
})
