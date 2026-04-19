import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import migrations from './migrations'
import Trip from './model/Trip'
import TripItem from './model/TripItem'
import Flight from './model/Flight'
import ActivityItem from './model/ActivityItem'
import User from './model/User'

// First, create the adapter
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  // on iOS, you might want to turn on WAL mode
  // dbName: 'myapp',
  // on Android, you might want to enable foreign keys
  // onSetUpError: error => {
  //   console.error(error)
  // }
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Trip,
    TripItem,
    Flight,
    ActivityItem,
    User,
  ],
  // optional actions
  // actionsEnabled: true,
})

/**
 * Initialize database by forcing table creation
 * WatermelonDB uses lazy table creation, so we need to write a temporary record
 * to each table to ensure they exist
 */
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing WatermelonDB tables...')
    const tempUserId = 'temp-user'
    
    // Force creation of trips table
    try {
      const trips = await database.get('trips').query().fetch()
      if (trips.length === 0) {
        await database.write(async () => {
          const tempTrip = await database.get<Trip>('trips').create(trip => {
            trip.userId = tempUserId
            trip.name = 'temp'
            trip.destination = 'temp'
            trip.startTime = new Date()
            trip.endTime = new Date()
            trip.createdAtUtc = new Date()
            trip.updatedAtUtc = new Date()
            trip.dbSyncStatus = 'synced'
            trip.dbSyncChanged = 'false'
          })
          await tempTrip.destroyPermanently()
        })
        console.log('✅ Created trips table')
      }
    } catch (error) {
      console.error('Error initializing trips table:', error)
    }

    // Force creation of trip_items table
    try {
      const tripItems = await database.get('trip_items').query().fetch()
      if (tripItems.length === 0) {
        await database.write(async () => {
          const tempItem = await database.get<TripItem>('trip_items').create(item => {
            item.userId = tempUserId
            item.tripId = 'temp'
            item.type = 'temp'
            item.title = 'temp'
            item.status = 'temp'
            item.icon = 'temp'
            item.createdAt = new Date()
            item.updatedAt = new Date()
            item.dbSyncStatus = 'synced'
            item.dbSyncChanged = 'false'
          })
          await tempItem.destroyPermanently()
        })
        console.log('✅ Created trip_items table')
      }
    } catch (error) {
      console.error('Error initializing trip_items table:', error)
    }

    // Force creation of flights table
    try {
      const flights = await database.get('flights').query().fetch()
      if (flights.length === 0) {
        await database.write(async () => {
          const tempFlight = await database.get<Flight>('flights').create(flight => {
            flight.userId = tempUserId
            flight.tripItemId = 'temp'
            flight.airline = 'temp'
            flight.flightNumber = 'temp'
            flight.departureAirport = 'temp'
            flight.arrivalAirport = 'temp'
            flight.departureTimeLocal = new Date()
            flight.departureTimeUtc = new Date()
            flight.arrivalTimeLocal = new Date()
            flight.arrivalTimeUtc = new Date()
            flight.createdAtUtc = new Date()
            flight.updatedAtUtc = new Date()
            flight.dbSyncStatus = 'synced'
            flight.dbSyncChanged = 'false'
          })
          await tempFlight.destroyPermanently()
        })
        console.log('✅ Created flights table')
      }
    } catch (error) {
      console.error('Error initializing flights table:', error)
    }

    // Force creation of activity_items table
    try {
      const activityItems = await database.get('activity_items').query().fetch()
      if (activityItems.length === 0) {
        await database.write(async () => {
          const tempActivity = await database.get<ActivityItem>('activity_items').create(activity => {
            activity.userId = tempUserId
            activity.tripItemId = 'temp'
            activity.title = 'temp'
            activity.startDate = new Date()
            activity.createdAt = new Date()
            activity.updatedAt = new Date()
            activity.dbSyncStatus = 'synced'
            activity.dbSyncChanged = 'false'
          })
          await tempActivity.destroyPermanently()
        })
        console.log('✅ Created activity_items table')
      }
    } catch (error) {
      console.error('Error initializing activity_items table:', error)
    }

    // Ensure users table exists (no temp user insertion)
    try {
      await database.get<User>('users').query().fetch()
      console.log('✅ Users table available')
    } catch (error: any) {
      console.error('Error ensuring users table exists:', error)
    }

    console.log('✅ Database initialization complete')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

export default database
