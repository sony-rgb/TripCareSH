import React, { useState } from 'react';
import { View, Platform, KeyboardAvoidingView, ScrollView, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SafeAreaView, Header, Icon, TextInput, Button, DatePicker, Text } from '@components';
import { BaseStyle, useTheme } from '@config';
import styles from './styles';
import { container } from '@services';

export default function ActivityAdd({ navigation }) {
  const { colors } = useTheme();
  const selectedTrip = useSelector((state: any) => state.trips.selectedTrip);
  const offsetKeyboard = Platform.select({ ios: 0, android: 20 });

  // Use stable string value instead of Date object to avoid infinite loops
  const tripStartStr = selectedTrip 
    ? new Date(selectedTrip.startTime).toISOString().slice(0, 10) 
    : '1950-01-01';
  const tripEndStr = selectedTrip 
    ? new Date(selectedTrip.endTime).toISOString().slice(0, 10) 
    : '2050-12-31';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState(tripStartStr); // Initialize with trip start
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState(tripStartStr); // Initialize with trip start
  const [endTime, setEndTime] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [success, setSuccess] = useState({
    title: true,
    startDate: true,
    startTime: true,
  });

  useFocusEffect(
    React.useCallback(() => {
      // Reset form when screen comes into focus
      setTitle('');
      setDescription('');
      setVenue('');
      setAddress('');
      setStartDate(tripStartStr); // Reset to trip start date
      setStartTime('');
      setEndDate(tripStartStr); // Reset to trip start date
      setEndTime('');
      setErrorMessage('');
      setSuccess({
        title: true,
        startDate: true,
        startTime: true,
      });
    }, [tripStartStr]) // Use stable string value instead of Date object
  );

  // Convert 12-hour time to 24-hour format (e.g., "2:30 PM" -> "14:30")
  const convertTo24Hour = (time12h: string): string => {
    const match = time12h.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return '';
    
    let [, hours, minutes, period] = match;
    let h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    
    if (h < 1 || h > 12 || m < 0 || m > 59) return '';
    
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period.toUpperCase() === 'AM' && h === 12) h = 0;
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const isValidTime = (value: string) => {
    // Check for 12-hour format with AM/PM
    const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return false;
    
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    
    return h >= 1 && h <= 12 && m >= 0 && m <= 59;
  };

  const validate = () => {
    // Validate time format (12-hour with AM/PM)
    const validStartTime = isValidTime(startTime.trim());
    const validEndTime = endTime.trim() === '' || isValidTime(endTime.trim());
    
    const nextSuccess = {
      title: title.trim() !== '',
      startDate: startDate.trim() !== '',
      startTime: validStartTime,
    };
    setSuccess(nextSuccess);
    
    if (!nextSuccess.title || !nextSuccess.startDate || !nextSuccess.startTime) {
      setErrorMessage('Title, Start Date, and Start Time (12-hour format with AM/PM, e.g., 2:30 PM) are required');
      return false;
    }
    if (!validEndTime) {
      setErrorMessage('End Time must be in 12-hour format with AM/PM (e.g., 6:00 PM)');
      return false;
    }
    return true;
  };

  const toDate = (dateStr: string, timeStr: string) => new Date(`${dateStr}T${timeStr || '00:00'}`);

  const onSave = async () => {
    if (!selectedTrip) {
      setErrorMessage('No trip selected. Please go back and select a trip first.');
      return;
    }
    if (!validate()) return;

    try {
      setSaving(true);
      setErrorMessage('');

      // Convert 12-hour times to 24-hour format for storage
      const startTime24 = convertTo24Hour(startTime);
      const endTime24 = endTime ? convertTo24Hour(endTime) : '';

      const start = toDate(startDate, startTime24);
      const end = endDate ? toDate(endDate, endTime24 || startTime24) : start;

      // Enforce trip bounds using string dates
      if (start < new Date(tripStartStr)) {
        setErrorMessage('Start date must be within the trip dates.');
        setSaving(false);
        return;
      }
      if (end > new Date(tripEndStr + 'T23:59:59')) {
        setErrorMessage('End date must be within the trip dates.');
        setSaving(false);
        return;
      }

      const result = await container.getActivityItemService().createActivityWithTripItem(selectedTrip.id, selectedTrip.userId, {
        title: title.trim(),
        description: description.trim() || undefined,
        venue: venue.trim() || undefined,
        address: address.trim() || undefined,
        startDate: start,
        endDate: end,
        startTime: startTime24,
        endTime: endTime24 || undefined,
        isCompleted,
      });

      if (!result) {
        throw new Error('Failed to save activity');
      }

      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving activity:', error);
      setErrorMessage(error.message || 'Unable to save activity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={'Add Activity'}
        renderLeft={() => <Icon name="times" size={20} color={colors.primary} enableRTL />}
        onPressLeft={() => navigation.goBack()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>
            {selectedTrip ? (
              <View style={styles.tripInfo(colors)}>
                <Text body2 style={{ color: colors.primary, fontWeight: '600' }}>
                  Adding activity to: {selectedTrip.name}
                </Text>
                <Text caption1 style={{ color: colors.gray, marginTop: 2 }}>
                  {selectedTrip.destination} • {new Date(selectedTrip.startTime).toLocaleDateString()} - {new Date(selectedTrip.endTime).toLocaleDateString()}
                </Text>
              </View>
            ) : (
              <View style={styles.tripWarning(colors)}>
                <Text body2 style={{ color: colors.accent, fontWeight: '600' }}>
                  No trip selected
                </Text>
                <Text caption1 style={{ color: colors.accent, marginTop: 2 }}>
                  Please go back and select a trip first
                </Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder={'Title *'}
              value={title}
              onChangeText={setTitle}
              success={success.title}
              onEndEditing={() => setSuccess(prev => ({ ...prev, title: title.trim() !== '' }))}
            />

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder={'Description'}
              value={description}
              multiline
              onChangeText={setDescription}
            />

            <TextInput
              style={styles.input}
              placeholder={'Venue'}
              value={venue}
              onChangeText={setVenue}
            />

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder={'Address'}
              value={address}
              multiline
              onChangeText={setAddress}
            />

            <DatePicker
              label={'Start Date *'}
              selected={startDate}
              style={styles.input}
              minDate={tripStartStr}
              maxDate={tripEndStr}
              current={tripStartStr}
              onChange={(date: string) => {
                setStartDate(date);
                if (endDate && new Date(endDate) < new Date(date)) {
                  setEndDate(date);
                }
              }}
              success={success.startDate}
              onEndEditing={() => setSuccess(prev => ({ ...prev, startDate: startDate.trim() !== '' }))}
            />

            <TextInput
              style={styles.input}
              placeholder={'Start Time * (12-hour format, e.g., 2:30 PM)'}
              value={startTime}
              onChangeText={setStartTime}
              success={success.startTime}
              onEndEditing={() => setSuccess(prev => ({ ...prev, startTime: isValidTime(startTime.trim()) }))}
            />

            <DatePicker
              label={'End Date'}
              selected={endDate}
              style={styles.input}
              minDate={tripStartStr}
              maxDate={tripEndStr}
              current={startDate || tripStartStr}
              onChange={(date: string) => {
                setEndDate(date);
                // keep end within range of start
                if (startDate && date && new Date(date) < new Date(startDate)) {
                  setEndDate(startDate);
                }
              }}
            />

            <TextInput
              style={styles.input}
              placeholder={'End Time (12-hour format, e.g., 6:00 PM)'}
              value={endTime}
              onChangeText={setEndTime}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Switch
                value={isCompleted}
                onValueChange={setIsCompleted}
              />
              <Text body2 style={{ marginLeft: 8 }}>
                Mark as completed
              </Text>
            </View>

            {errorMessage !== '' && (
              <Text style={{ ...styles.errorText, color: colors.accent }}>
                {errorMessage}
              </Text>
            )}

            <Button
              full
              loading={saving}
              onPress={onSave}
              style={{ marginTop: 10 }}
            >
              Save Activity
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

