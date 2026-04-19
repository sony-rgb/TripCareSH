import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Header, Text, Icon } from '@components';
import TripCalendar from '../../components/TripCalendar';
import Itinerary from '../../components/Itinerary';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@config';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { MenuItem } from '../../components/PopupMenu';
import TripItem from '../../database/model/TripItem';
import { BaseColor } from '@config';
import { container } from '../../services/container';
interface TripData {
  id: string;
  name: string;
  destinationId: string;
  destination: string;
  description: string;
  startTime: Date;
  endTime: Date;
  userId: string;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export default function TripDetails({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const selectedTrip = useSelector((state: any) => state.trips.selectedTrip) as TripData | null;
  const [tripItems, setTripItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showTripDetails, setShowTripDetails] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'edit_trip',
      title: t('edit_trip'),
      icon: 'edit',
      onPress: () => {
        if (selectedTrip) {
          navigation.navigate('TripAdd', { tripId: selectedTrip.id });
        }
      },
    },
    {
      id: 'add_flight',
      title: t('add_flight'),
      icon: 'plane',
      onPress: () => {
        navigation.navigate('FlightAdd', { selectedDate: selectedDate });
      },
    },
    {
      id: 'add_hotel',
      title: t('add_hotel'),
      icon: 'bed',
      onPress: () => {
        // Navigate to hotel booking screen when implemented
        console.log('Navigate to add hotel');
      },
    },
    {
      id: 'add_activity',
      title: 'Add Activity',
      icon: 'calendar',
      onPress: () => {
        navigation.navigate('ActivityAdd');
      },
    },
  ];

  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
    return '';
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    
    const formatSingleDate = (date) => {
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
      const day = date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' });
      const year = date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' });
      return `${weekday}, ${month} ${day}, ${year}`;
    };
    
    const startFormatted = formatSingleDate(startDate);
    const endFormatted = formatSingleDate(endDate);
    
    return `${startFormatted} to ${endFormatted}`;
  };

  const getDuration = (start, end) => {
    if (!start || !end) return '';
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    
    // Reset to start of day for accurate day counting
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    // Calculate difference in days and add 1 to include both start and end days
    const diffTime = Math.abs(endDay.getTime() - startDay.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  // Fetch trip items when screen comes into focus or selected trip changes
  const fetchTripItems = useCallback(async () => {
    if (!selectedTrip) {
      setTripItems([]);
      setSelectedDate(null);
      return;
    }

    try {
      setLoadingItems(true);
      const items = await container.getTripItemService().getTripItems(selectedTrip.id);
      setTripItems(items);
      
      // Set default selected date based on available items
      if (items && items.length > 0) {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Check if today has items
        const todayItems = items.filter(item => {
          if (!item.startDate) return false;
          const itemDate = new Date(item.startDate);
          const itemStart = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          return itemStart.getTime() === todayStart.getTime();
        });
        
        if (todayItems.length > 0) {
          // Today has items, select today
          setSelectedDate(todayStart);
          console.log('📅 Defaulting to today (has items):', todayStart.toDateString());
        } else {
          // Find the first date with items
          const sortedItems = items
            .filter(item => item.startDate)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          
          if (sortedItems.length > 0) {
            const firstItemDate = new Date(sortedItems[0].startDate);
            const firstDate = new Date(firstItemDate.getFullYear(), firstItemDate.getMonth(), firstItemDate.getDate());
            setSelectedDate(firstDate);
            console.log('📅 Defaulting to first available date:', firstDate.toDateString());
          }
        }
      } else {
        setSelectedDate(null);
      }
    } catch (error) {
      console.error('Error fetching trip items:', error);
      setTripItems([]);
      setSelectedDate(null);
    } finally {
      setLoadingItems(false);
    }
  }, [selectedTrip]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTripItems();
    }, [fetchTripItems])
  );

  // Organize trip items for the Itinerary component
  const handleEditTripItem = (item: any) => {
    if (item.type === 'activity') {
      navigation.navigate('ActivityEdit', { tripItemId: item.id });
      return;
    }
    console.log('✏️ Edit trip item:', item);
  };

  const handleDateSelect = (date: Date) => {
    console.log('📅 Date selected:', date.toDateString());
    setSelectedDate(date);
  };

  const formatItineraryTitle = (date: Date) => {
    return `Itinerary - ${date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })}`;
  };

  const organizeTripItems = () => {
    if (!tripItems || tripItems.length === 0 || !selectedDate) {
      return [];
    }

    // Include items whose range covers the selected date
    const filteredItems = tripItems.filter(item => {
      if (!item.startDate) return false;

      const start = item.startDate ? new Date(item.startDate) : null;
      const end = item.endDate ? new Date(item.endDate) : start;

      if (!start) return false;

      const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : startDay;

      return dayStart >= startDay && dayStart <= endDay;
    });
    
    console.log(`📅 Showing ${filteredItems.length} items for date: ${selectedDate.toDateString()}`);

    // Sort by start date (chronological order)
    const sortedItems = filteredItems.sort((a, b) => {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    return sortedItems.map(item => {
      // All fields are now directly on the trip item (consolidated schema)
      const startDate = item.startDate;
      const endDate = item.endDate;
      const startTime = item.startTime;
      const endTime = item.endTime;
      const isCompleted = item.isCompleted ?? false;

      const formatTime = (date: any, fallback?: string) => {
        if (fallback) return fallback;
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      };

      return {
        id: item.id,
        title: item.title,
        description: item.description || '',
        startDate,
        endDate,
        startTime: startDate ? formatTime(startDate, startTime) : startTime,
        endTime: endDate ? formatTime(endDate, endTime) : endTime,
        location: item.venue || item.address || item.location || '',
        icon: item.icon || 'calendar',
        type: item.type,
        isCompleted,
      };
    });
  };

  const itineraryItems = organizeTripItems();
  const hasItemsForSelectedDate = itineraryItems.length > 0;

  if (!selectedTrip) {
    return (
      <View style={styles.container}>
        <Header
          title={t('trip_details')}
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={colors.primary} />;
          }}
          onPressLeft={() => navigation.goBack()}
        />
        <View style={styles.noTripContainer}>
          <Text title2 semibold style={styles.noTripText}>
            {t('no_trip_selected')}
          </Text>
          <Text body1 grayColor style={styles.noTripSubtext}>
            {t('select_trip_to_view_details')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={selectedTrip.name}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => navigation.goBack()}
        menuItems={menuItems}
        titleNumberOfLines={0}
        styleCenter={styles.headerCenter}
      />
      <ScrollView style={styles.content}>
        {/* Trip summary card with expandable details */}
        <View style={styles.tripHeaderCard}>
          <TouchableOpacity
            style={styles.tripHeaderRow}
            onPress={() => setShowTripDetails(!showTripDetails)}
            activeOpacity={0.7}
          >
            <Text body1 semibold style={styles.tripTitle}>
              {formatDateRange(selectedTrip.startTime, selectedTrip.endTime)}
            </Text>
            <Icon
              name={showTripDetails ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.text}
            />
          </TouchableOpacity>

          {showTripDetails && (
            <View style={styles.tripDetailsBody}>
              <View style={styles.infoRow}>
                <Text caption1 light style={styles.infoLabel}>
                  Destination
                </Text>
                <Text headline style={styles.infoValue}>
                  {selectedTrip.destination}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text caption1 light style={styles.infoLabel}>
                  {t('duration')}
                </Text>
                <Text headline style={styles.infoValue}>
                  {getDuration(selectedTrip.startTime, selectedTrip.endTime)}
                </Text>
              </View>

              {selectedTrip.description && (
                <View style={styles.descriptionRow}>
                  <Text body2 style={styles.descriptionText}>
                    {showFullDescription 
                      ? selectedTrip.description 
                      : selectedTrip.description.length > 200 
                        ? selectedTrip.description.substring(0, 200) + '...' 
                        : selectedTrip.description
                    }
                  </Text>
                  {selectedTrip.description.length > 200 && (
                    <TouchableOpacity 
                      style={styles.viewMoreButton}
                      onPress={() => setShowFullDescription(!showFullDescription)}
                    >
                      <Text caption1 accentColor>
                        {showFullDescription ? 'View Less' : 'View More'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Calendar Days Section */}
        <View style={styles.calendarSection}>
          <TripCalendar
            startDate={selectedTrip.startTime}
            endDate={selectedTrip.endTime}
            tripItems={tripItems}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </View>
        
        {/* Itinerary Section */}
        <View style={styles.itinerarySection}>
          <Text headline semibold style={styles.sectionTitle}>
            {selectedDate ? formatItineraryTitle(selectedDate) : 'Itinerary'}
          </Text>
          {hasItemsForSelectedDate ? (
            <Itinerary 
              items={itineraryItems}
              onEditItem={handleEditTripItem}
            />
          ) : (
            <View style={styles.noItemsContainer}>
              <Icon
                name="calendar"
                size={48}
                color={BaseColor.grayColor}
              />
              <Text body1 grayColor style={styles.noItemsText}>
                No activities planned yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 