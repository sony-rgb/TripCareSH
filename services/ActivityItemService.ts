import TripItem from '../database/model/TripItem'
import ActivityItem from '../database/model/ActivityItem'
import { ITripItemRepository } from '../repositories/interfaces/ITripItemRepository'
import { IActivityItemRepository } from '../repositories/interfaces/IActivityItemRepository'
import { IActivityItemService } from './interfaces/IActivityItemService'

export class ActivityItemService implements IActivityItemService {
  constructor(
    private tripItemRepository: ITripItemRepository,
    private activityItemRepository: IActivityItemRepository
  ) {}

  async getActivityByTripItemId(tripItemId: string): Promise<any | null> {
    try {
      const tripItem = await this.tripItemRepository.findById(tripItemId)
      if (!tripItem || tripItem.type !== 'activity') {
        return null
      }

      // Fetch the associated activity_item for complete data
      const activityItem = await this.activityItemRepository.findByTripItemId(tripItemId)
      
      if (!activityItem) {
        console.warn('Activity item not found for trip item:', tripItemId)
        // Return tripItem with empty activity fields for backward compatibility
        return {
          ...tripItem,
          venue: '',
          address: '',
          startTime: '',
          endTime: '',
          isCompleted: false,
        }
      }

      // Combine data from both tables
      const combinedActivity = {
        // From TripItem (generic fields)
        id: tripItem.id,
        tripId: tripItem.tripId,
        userId: tripItem.userId,
        type: tripItem.type,
        title: activityItem.title || tripItem.title, // Prefer activity item title
        description: activityItem.description || tripItem.description,
        startDate: activityItem.startDate || tripItem.startDate,
        endDate: activityItem.endDate || tripItem.endDate,
        status: tripItem.status,
        icon: tripItem.icon,
        createdAt: tripItem.createdAt,
        updatedAt: tripItem.updatedAt,
        
        // From ActivityItem (activity-specific fields)
        activityItemId: activityItem.id,
        venue: activityItem.venue || '',
        address: activityItem.address || '',
        startTime: activityItem.startTime || '',
        endTime: activityItem.endTime || '',
        isCompleted: activityItem.isCompleted ?? false,
      }

      console.log('Fetched combined activity data:', {
        tripItemId,
        activityItemId: activityItem.id,
        hasVenue: !!activityItem.venue,
        hasAddress: !!activityItem.address,
        isCompleted: activityItem.isCompleted
      })

      return combinedActivity
    } catch (error) {
      console.error('Error fetching activity by trip item id:', error)
      return null
    }
  }

  async createActivityWithTripItem(
    tripId: string,
    userId: string,
    payload: {
      title: string
      description?: string
      venue?: string
      address?: string
      startDate: Date
      endDate?: Date | null
      startTime?: string
      endTime?: string
      isCompleted?: boolean
    }
  ): Promise<{ tripItem: TripItem } | null> {
    try {
      // Step 1: Create the TripItem (generic container)
      const tripItem = await this.tripItemRepository.create({
        userId,
        tripId,
        type: 'activity',
        title: payload.title,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate ?? payload.startDate,
        status: payload.isCompleted ? 'Completed' : 'Pending',
        icon: 'calendar',
      })

      // Step 2: Create the ActivityItem (activity-specific data)
      const activityItem = await this.activityItemRepository.create({
        userId,
        tripItemId: tripItem.id,
        title: payload.title,
        description: payload.description,
        venue: payload.venue,
        address: payload.address,
        startDate: payload.startDate,
        endDate: payload.endDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        isCompleted: payload.isCompleted ?? false,
      })

      console.log('Successfully created activity:', {
        tripItemId: tripItem.id,
        activityItemId: activityItem.id,
        tripId,
        title: payload.title
      })

      return { tripItem }
    } catch (error) {
      console.error('Error creating activity:', error)
      return null
    }
  }

  async updateActivityWithTripItem(
    tripItemId: string,
    payload: {
      title: string
      description?: string
      venue?: string
      address?: string
      startDate: Date
      endDate?: Date | null
      startTime?: string
      endTime?: string
      isCompleted?: boolean
    }
  ): Promise<{ tripItem: TripItem } | null> {
    try {
      // Step 1: Update the TripItem (generic fields only)
      const tripItem = await this.tripItemRepository.findById(tripItemId)
      if (!tripItem) throw new Error('TripItem not found')

      await this.tripItemRepository.update(tripItem, {
        title: payload.title,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate ?? payload.startDate,
        status: payload.isCompleted ? 'Completed' : 'Pending',
      })

      // Step 2: Update the ActivityItem (activity-specific fields)
      const activityItem = await this.activityItemRepository.findByTripItemId(tripItemId)
      if (!activityItem) {
        // Create activity item if it doesn't exist (migration scenario)
        await this.activityItemRepository.create({
          userId: tripItem.userId,
          tripItemId: tripItem.id,
          title: payload.title,
          description: payload.description,
          venue: payload.venue,
          address: payload.address,
          startDate: payload.startDate,
          endDate: payload.endDate,
          startTime: payload.startTime,
          endTime: payload.endTime,
          isCompleted: payload.isCompleted ?? false,
        })
        console.log('Created new activity item for existing trip item:', tripItemId)
      } else {
        // Update existing activity item
        await this.activityItemRepository.update(activityItem, {
          title: payload.title,
          description: payload.description,
          venue: payload.venue,
          address: payload.address,
          startDate: payload.startDate,
          endDate: payload.endDate,
          startTime: payload.startTime,
          endTime: payload.endTime,
          isCompleted: payload.isCompleted,
        })
        console.log('Updated existing activity item:', activityItem.id)
      }

      console.log('Successfully updated activity:', {
        tripItemId: tripItem.id,
        title: payload.title
      })

      return { tripItem }
    } catch (error) {
      console.error('Error updating activity:', error)
      return null
    }
  }
}
