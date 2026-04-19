import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';
import {BaseColor, useTheme} from '@config';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 2,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  right: {
    alignItems: 'flex-end',
  },
});

export default function TripItem({
  style = {},
  title = '',
  destination = '',
  startDate = null,
  endDate = null,
  description = '',
  isUpcoming = false,
  onPress = () => {},
}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
    return '';
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

  const handlePress = () => {
    setIsPressed(true);
    // Reset pressed state after a short delay
    setTimeout(() => setIsPressed(false), 150);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.contain,
        {
          borderBottomWidth: 1, 
          borderBottomColor: colors.border,
          backgroundColor: isPressed ? colors.accent + '20' : 'transparent',
          elevation: isPressed ? 4 : 0,
          shadowOffset: isPressed ? {width: 0, height: 2} : {width: 0, height: 0},
          shadowOpacity: isPressed ? 0.25 : 0,
          shadowRadius: isPressed ? 4 : 0,
        },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.8}>
      <View 
        style={[
          styles.thumb, 
          {
            backgroundColor: isPressed ? colors.primary : colors.accent,
            transform: [{scale: isPressed ? 1.1 : 1}],
          }
        ]}>
        <Icon
          name="globe"
          color={BaseColor.whiteColor}
          size={24}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.left}>
          <Text 
            headline 
            semibold 
            numberOfLines={1}
            style={{
              color: isPressed ? colors.primary : undefined,
            }}>
            {title}
          </Text>
          <Text
            numberOfLines={1}
            body1
            grayColor
            style={{paddingTop: 5}}>
            {destination}
          </Text>
          {description && (
            <Text
              numberOfLines={1}
              footnote
              grayColor
              style={{paddingTop: 3}}>
              {description}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <Text body2 grayColor numberOfLines={1}>
            {formatDate(startDate)}
          </Text>
          <Text body2 grayColor numberOfLines={1} style={{marginTop: 2}}>
            {getDuration(startDate, endDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

TripItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  destination: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  description: PropTypes.string,
  isUpcoming: PropTypes.bool,
  onPress: PropTypes.func,
}; 