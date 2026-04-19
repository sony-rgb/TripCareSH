import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@components';
import { useTheme } from '@config';
import styles from './styles';

interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  startDate?: Date | string;
  endDate?: Date | string;
  startTime?: string;
  endTime?: string;
  location?: string;
  icon?: string;
  type?: string;
  isCompleted?: boolean;
}

interface ItineraryProps {
  items?: ItineraryItem[];
  onEditItem?: (item: ItineraryItem) => void;
}

export default function Itinerary({ items = [], onEditItem }: ItineraryProps) {
  const { colors } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItemExpansion = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };

  const handleEditItem = (item: ItineraryItem) => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Convert 24-hour time to 12-hour format with AM/PM (e.g., "14:30" -> "2:30 PM")
  const formatTime = (time24h?: string) => {
    if (!time24h || !time24h.includes(':')) return time24h || '';
    
    const [hours, minutes] = time24h.split(':').map(s => parseInt(s, 10));
    if (isNaN(hours) || isNaN(minutes)) return time24h;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    let h = hours % 12;
    if (h === 0) h = 12;
    
    return `${h}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const renderTimeRange = (item: ItineraryItem) => {
    const dateLabel = formatDate(item.startDate);
    const endDateLabel = item.endDate ? formatDate(item.endDate) : undefined;
    
    // Convert times to 12-hour format
    const startTimeFormatted = formatTime(item.startTime);
    const endTimeFormatted = formatTime(item.endTime);
    
    const timeLabel = startTimeFormatted && endTimeFormatted
      ? `${startTimeFormatted} - ${endTimeFormatted}`
      : startTimeFormatted || '';

    return (
      <>
        {(dateLabel || timeLabel) && (
          <Text caption1 light style={styles.itemTime}>
            {dateLabel}
            {endDateLabel && endDateLabel !== dateLabel ? ` → ${endDateLabel}` : ''}
            {timeLabel ? (dateLabel || endDateLabel ? ` • ${timeLabel}` : timeLabel) : ''}
          </Text>
        )}
      </>
    );
  };

  const renderItineraryItem = (item: ItineraryItem) => {
    const isExpanded = expandedItems.has(item.id);
    const shouldShowViewMore = item.description.length > 150;
    const displayDescription = isExpanded 
      ? item.description 
      : shouldShowViewMore 
        ? item.description.substring(0, 150) + '...' 
        : item.description;

    return (
      <View key={item.id} style={styles.itineraryRow}>
        {/* Icon on the left */}
        <View style={styles.iconContainer}>
          <Icon
            name={item.icon || 'calendar'}
            size={24}
            color={colors.primary}
          />
        </View>

        {/* Card on the right */}
        <View style={styles.cardContainer}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => handleEditItem(item)} style={styles.itineraryCard}>
            {/* Edit icon in top right */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => handleEditItem(item)}
            >
              <Icon
                name="edit"
                size={16}
                color={colors.border}
              />
            </TouchableOpacity>

            <Text headline semibold style={styles.itemTitle}>
              {item.title}
            </Text>
            <View style={styles.badgeRow}>
              {typeof item.isCompleted === 'boolean' && (
                <View style={[styles.badge, item.isCompleted ? styles.badgeCompleted : null]}>
                  <Text caption1 style={styles.badgeText}>
                    {item.isCompleted ? 'Completed' : 'Open'}
                  </Text>
                </View>
              )}
            </View>
            {renderTimeRange(item)}
            {item.location && (
              <Text caption1 light style={styles.itemLocation}>
                {item.location}
              </Text>
            )}
            <Text body2 style={styles.itemDescription}>
              {displayDescription}
            </Text>
            {shouldShowViewMore && (
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => toggleItemExpansion(item.id)}
              >
                <Text caption1 accentColor>
                  {isExpanded ? 'View Less' : 'View More'}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="calendar" size={48} color={colors.border} />
        <Text body2 grayColor style={styles.emptyText}>
          No activities planned yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map(renderItineraryItem)}
    </View>
  );
}
