import TripItem from '../database/model/TripItem'
import ActivityItem from '../database/model/ActivityItem'
import Flight from '../database/model/Flight'
import { ITripItemService } from './interfaces/ITripItemService'
import { ITripItemRepository } from '../repositories/interfaces/ITripItemRepository'
import { IActivityItemRepository } from '../repositories/interfaces/IActivityItemRepository'
import { IFlightRepository } from '../repositories/interfaces/IFlightRepository'

export class TripItemService implements ITripItemService {
  private tripItemRepository: ITripItemRepository
  private activityRepository: IActivityItemRepository
  private flightRepository: IFlightRepository

  constructor(
    tripItemRepository: ITripItemRepository, 
    activityRepository: IActivityItemRepository,
    flightRepository: IFlightRepository
  ) {
    this.tripItemRepository = tripItemRepository
    this.activityRepository = activityRepository
    this.flightRepository = flightRepository
  }
  async getTripItems(tripId: string): Promise<any[]> {
    try {
      console.log('🔍 Fetching trip items for trip ID:', tripId)
      
      const tripItems = await this.tripItemRepository.findByTripId(tripId)

      // Enrich items with type-specific data
      const enrichedItems = await Promise.all(
        tripItems.map(async (item) => {
          // Handle activities
          if (item.type === 'activity') {
            try {
              // Fetch the associated activity_item
              const activityItem = await this.activityRepository.findByTripItemId(item.id)
              
              if (!activityItem) {
                console.warn('⚠️ No ActivityItem found for activity TripItem:', item.id)
                // Return item with empty activity fields
                return {
                  ...item,
                  venue: '',
                  address: '',
                  startTime: '',
                  endTime: '',
                  isCompleted: false,
                }
              }
              
              // Flatten activity fields directly onto the item
              return {
                // From TripItem
                id: item.id,
                tripId: item.tripId,
                userId: item.userId,
                type: item.type,
                title: activityItem.title || item.title,
                description: activityItem.description || item.description,
                startDate: activityItem.startDate || item.startDate,
                endDate: activityItem.endDate || item.endDate,
                status: item.status,
                icon: item.icon,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                
                // From ActivityItem (flattened)
                activityItemId: activityItem.id,
                venue: activityItem.venue || '',
                address: activityItem.address || '',
                startTime: activityItem.startTime || '',
                endTime: activityItem.endTime || '',
                isCompleted: activityItem.isCompleted ?? false,
              }
            } catch (e) {
              console.error('❌ Error fetching activity for trip item', item.id, e)
              return item
            }
          }
          
          // Handle flights
          if (item.type === 'flight') {
            try {
              // Fetch the associated flight
              const flight = await this.flightRepository.findByTripItemId(item.id)
              
              if (!flight) {
                console.warn('⚠️ No Flight found for flight TripItem:', item.id)
                // Return item as-is with empty flight fields
                return {
                  ...item,
                  airline: '',
                  flightNumber: '',
                  departureAirport: '',
                  arrivalAirport: '',
                }
              }
              
              // Flatten flight fields directly onto the item
              return {
                // From TripItem
                id: item.id,
                tripId: item.tripId,
                userId: item.userId,
                type: item.type,
                title: item.title,
                description: item.description,
                startDate: flight.departureTimeLocal || item.startDate,
                endDate: flight.arrivalTimeLocal || item.endDate,
                status: item.status,
                icon: item.icon,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                
                // From Flight (flattened)
                flightId: flight.id,
                airline: flight.airline || '',
                flightNumber: flight.flightNumber || '',
                departureAirport: flight.departureAirport || '',
                arrivalAirport: flight.arrivalAirport || '',
                departureTimeLocal: flight.departureTimeLocal,
                departureTimeUtc: flight.departureTimeUtc,
                arrivalTimeLocal: flight.arrivalTimeLocal,
                arrivalTimeUtc: flight.arrivalTimeUtc,
                confirmationNumber: flight.confirmationNumber || '',
                notes: flight.notes || '',
              }
            } catch (e) {
              console.error('❌ Error fetching flight for trip item', item.id, e)
              return item
            }
          }
          
          // Return non-activity/non-flight items as-is
          return item
        })
      )
      
      console.log('📋 Found', enrichedItems.length, 'items for trip', tripId)
      return enrichedItems
    } catch (error) {
      console.error('❌ Error fetching trip items:', error)
      return []
    }
  }

  async getTripItemsByType(tripId: string, type: string): Promise<TripItem[]> {
    try {
      const allTripItems = await this.tripItemRepository.findByTripId(tripId)
      return allTripItems.filter(item => item.type === type)
    } catch (error) {
      console.error('Error fetching trip items by type:', error)
      return []
    }
  }

  async getTripItemsByStatus(tripId: string, status: string): Promise<TripItem[]> {
    try {
      const allTripItems = await this.tripItemRepository.findByTripId(tripId)
      return allTripItems.filter(item => item.status === status)
    } catch (error) {
      console.error('Error fetching trip items by status:', error)
      return []
    }
  }

  async createTripItem(tripItemData: Partial<TripItem>): Promise<TripItem | null> {
    try {
      if (!tripItemData.userId) {
        throw new Error('userId is required to create a trip item');
      }
      const tripItem = await this.tripItemRepository.create(tripItemData)
      return tripItem
    } catch (error) {
      console.error('Error creating trip item:', error)
      return null
    }
  }

  async updateTripItem(id: string, updates: Partial<TripItem>): Promise<boolean> {
    try {
      const tripItem = await this.tripItemRepository.findById(id)
      if (!tripItem) {
        throw new Error('TripItem not found')
      }
      await this.tripItemRepository.update(tripItem, updates)
      return true
    } catch (error) {
      console.error('Error updating trip item:', error)
      return false
    }
  }

  async deleteTripItem(id: string): Promise<boolean> {
    try {
      await this.tripItemRepository.delete(id)
      return true
    } catch (error) {
      console.error('Error deleting trip item:', error)
      return false
    }
  }
}

// Remove singleton export - will be managed by container
