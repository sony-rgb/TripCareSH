import { appSchema, tableSchema } from '@nozbe/watermelondb'

/**
 * WatermelonDB Schema
 * 
 * SIMPLIFIED ID STRATEGY:
 * - The 'id' field is the same UUID used on both client and server
 * - No separate server_id needed - the id IS the universal identifier
 * - When client creates records, WatermelonDB generates the UUID
 * - When server creates records, client uses the server's UUID as the local id
 */
export default appSchema({
  version: 9, // Reverted to separate flights and activity_items tables
  tables: [
    tableSchema({
      name: 'trips',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'destination', type: 'string' },
        { name: 'destination_id', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'start_time', type: 'number' },
        { name: 'end_time', type: 'number' },
        { name: 'created_at_utc', type: 'number' },
        { name: 'updated_at_utc', type: 'number' },
        // Sync tracking fields (client-side only)
        { name: 'sync_status', type: 'string' },
        { name: 'sync_changed', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'trip_items',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'trip_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' }, // 'flight', 'activity', 'lodging', etc.
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number', isOptional: true },
        { name: 'end_date', type: 'number', isOptional: true },
        { name: 'status', type: 'string', isOptional: true },
        { name: 'icon', type: 'string' },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'booking_reference', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'price', type: 'number', isOptional: true },
        // Common fields
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // Sync tracking fields (client-side only)
        { name: 'sync_status', type: 'string' },
        { name: 'sync_changed', type: 'string' },
      ]
    }),
    tableSchema({
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
        // Sync tracking fields (client-side only)
        { name: 'sync_status', type: 'string' },
        { name: 'sync_changed', type: 'string' },
      ]
    }),
    tableSchema({
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
        // Sync tracking fields (client-side only)
        { name: 'sync_status', type: 'string' },
        { name: 'sync_changed', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'home_city_id', type: 'string' },
        { name: 'home_city_name', type: 'string', isOptional: true },
        { name: 'updated_at_utc', type: 'number' },
      ]
    })
  ]
})
