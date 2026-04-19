import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@components';
import { useTheme } from '@config';
import styles from './styles';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  monthAbbr: string;
  isToday: boolean;
}

interface TripCalendarProps {
  startDate: Date;
  endDate: Date;
  tripItems?: any[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export default function TripCalendar({ 
  startDate, 
  endDate, 
  tripItems = [],
  onDateSelect,
  selectedDate 
}: TripCalendarProps) {
  const { colors } = useTheme();

  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    
    // Reset time to start of day for comparison
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Create a set of dates that have trip items for efficient lookup (for potential future use)
    const datesWithItems = new Set<string>();
    tripItems.forEach(item => {
      if (item.startDate) {
        const itemDate = new Date(item.startDate);
        const dateKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}`;
        datesWithItems.add(dateKey);
      }
    });
    
    // Include all days in the date range, regardless of whether they have trip items
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const isToday = dayStart.getTime() === todayStart.getTime();
      
      days.push({
        date: new Date(currentDate),
        dayNumber: currentDate.getDate(),
        monthAbbr: currentDate.toLocaleDateString('en-US', { month: 'short' }),
        isToday,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const handleDatePress = (day: CalendarDay) => {
    if (onDateSelect) {
      onDateSelect(day.date);
    }
  };

  const renderCalendarDay = ({ item }: { item: CalendarDay }) => {
    const isSelected = selectedDate && 
      item.date.getDate() === selectedDate.getDate() &&
      item.date.getMonth() === selectedDate.getMonth() &&
      item.date.getFullYear() === selectedDate.getFullYear();

    const getDayColor = () => {
      if (isSelected) return colors.whiteColor;
      if (item.isToday) return colors.primary;
      return colors.border;
    };

    const getBackgroundColor = () => {
      if (isSelected) return colors.primary;
      if (item.isToday) return colors.primary + '15';
      return colors.border + '10';
    };

    const getBorderColor = () => {
      if (isSelected) return colors.primary;
      if (item.isToday) return colors.primary;
      return colors.border;
    };

    return (
      <TouchableOpacity
        style={[
          styles.calendarDayItem,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: 1,
          }
        ]}
        onPress={() => handleDatePress(item)}
        activeOpacity={0.7}
      >
        <Text
          caption1
          style={[styles.monthText, { color: getDayColor() }]}
        >
          {item.monthAbbr}
        </Text>
        <Text
          title3
          semibold
          style={[styles.dayText, { color: getDayColor() }]}
        >
          {item.dayNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <View style={styles.calendarSection}>
      <FlatList
        data={calendarDays}
        renderItem={renderCalendarDay}
        keyExtractor={(item) => item.date.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.calendarList}
      />
    </View>
  );
}
