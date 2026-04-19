import React, { useState } from 'react';
import { View, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { SafeAreaView, Header, Icon, TextInput, Button, DatePicker, Text } from '@components';
import { AutocompleteModal, AutocompleteOption, FetchOptionsFn } from '../../components/Autocomplete';
import { BaseStyle } from '@config';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@config';
import { container } from '@services'
import i18next from 'i18next';
import { API_BASE_URL } from '../../appConfig';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { handleUnauthorizedError } from '../../utils/unauthorizedHandler';

export default function TripAdd({ navigation, route }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const nav = useNavigation<any>();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const tripId = route?.params?.tripId;
  const isEditMode = !!tripId;
  
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resetKey, setResetKey] = useState(0);
  const [loadingTrip, setLoadingTrip] = useState(false);

  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    tripName: '',
    destination: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  // Field touched states (for showing validation only after user interacts)
  const [touched, setTouched] = useState({
    tripName: false,
    destination: false,
    startTime: false,
    endTime: false,
    description: false,
  });

  // Load trip data if editing
  useFocusEffect(
    React.useCallback(() => {
      const loadTripData = async () => {
        if (tripId) {
          try {
            setLoadingTrip(true);
            const trip = await container.getTripService().getTripById(tripId);
            if (trip) {
              setTripName(trip.name || '');
              setDestination(trip.destination || '');
              setDestinationId(trip.destinationId || '');
              setDescription(trip.description || '');
              // Format dates for DatePicker (YYYY-MM-DD format)
              if (trip.startTime) {
                const startDate = trip.startTime instanceof Date ? trip.startTime : new Date(trip.startTime);
                setStartTime(startDate.toISOString().split('T')[0]);
              }
              if (trip.endTime) {
                const endDate = trip.endTime instanceof Date ? trip.endTime : new Date(trip.endTime);
                setEndTime(endDate.toISOString().split('T')[0]);
              }
              setResetKey(prev => prev + 1); // Force re-render of components with keys
            }
          } catch (error: any) {
            console.error('Error loading trip:', error);
            setErrorMessage(error.message || 'Failed to load trip');
          } finally {
            setLoadingTrip(false);
          }
        } else {
          // Clear all fields when creating new trip
          setTripName('');
          setDestination('');
          setDestinationId('');
          setDescription('');
              setStartTime('');
              setEndTime('');
              setErrorMessage('');
              setResetKey(prev => prev + 1);
              setFieldErrors({
                tripName: '',
                destination: '',
                startTime: '',
                endTime: '',
                description: '',
              });
              setTouched({
                tripName: false,
                destination: false,
                startTime: false,
                endTime: false,
                description: false,
              });
        }
      };

      loadTripData();
    }, [tripId])
  );

  /**
   * Validate individual field
   */
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'tripName':
        if (!value || value.trim().length === 0) {
          return t('trip_name_required');
        }
        if (value.length > 80) {
          return t('trip_name_length');
        }
        return '';
      
      case 'destination':
        if (!value || value.trim().length === 0) {
          return t('destination_required');
        }
        // For new trips, destinationId is required. For editing, if destination is set, allow it even without destinationId
        if (!isEditMode && !destinationId) {
          return t('destination_required');
        }
        return '';
      
      case 'startTime':
        if (!value || value.trim().length === 0) {
          return t('start_date_required');
        }
        return '';
      
      case 'endTime':
        if (!value || value.trim().length === 0) {
          return t('end_date_required');
        }
        if (startTime && value < startTime) {
          return t('end_date_before_start_date');
        }
        return '';
      
      case 'description':
        if (value && value.length > 500) {
          return t('description_length');
        }
        return '';
      
      default:
        return '';
    }
  };

  /**
   * Search for cities using the guest location API
   */
  const searchCities: FetchOptionsFn = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/guest-location/search?q=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return (data.cities || []).map((city: any) => ({
        id: city.placeId,
        label: city.name,
        value: city.placeId,
      }));
    } catch (error) {
      console.error('[TripAdd] Error fetching cities:', error);
      throw new Error('Unable to fetch cities. Please check your connection.');
    }
  };
  
  /**
   * Handle city selection from autocomplete
   */
  const handleCitySelect = (option: AutocompleteOption) => {
    setDestination(option.label);
    setDestinationId(option.id);
    handleBlur('destination');
    setCityModalVisible(false);
  };

  /**
   * Handle field blur - validate and mark as touched
   */
  const handleBlur = (field: string) => {
    setTouched({...touched, [field]: true});
    
    // Get the current value for the field
    let value: any;
    switch (field) {
      case 'tripName': value = tripName; break;
      case 'destination': value = destination; break;
      case 'startTime': value = startTime; break;
      case 'endTime': value = endTime; break;
      case 'description': value = description; break;
      default: value = '';
    }
    
    const error = validateField(field, value);
    setFieldErrors({...fieldErrors, [field]: error});
  };

  const onSaveTrip = async () => {
    // Mark all fields as touched to show validation errors
    const newTouched = {
      tripName: true,
      destination: true,
      startTime: true,
      endTime: true,
      description: true,
    };
    setTouched(newTouched);

    // Validate all fields
    const errors = {
      tripName: validateField('tripName', tripName),
      destination: validateField('destination', destination),
      startTime: validateField('startTime', startTime),
      endTime: validateField('endTime', endTime),
      description: validateField('description', description),
    };
    setFieldErrors(errors);

    // Check if form is valid
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      if (isEditMode && tripId) {
        // Update existing trip
        const updateData: any = {
          name: tripName,
          destination: destination,
          description: description,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        };
        // Only include destinationId if it's set (to avoid overwriting with empty string)
        if (destinationId) {
          updateData.destinationId = destinationId;
        }
        await container.getTripService().update(tripId, updateData);
      } else {
        // Create new trip
        const currentUser = await container.getAuthService().getCurrentUser();
        if (!currentUser) {
          setErrorMessage('User not logged in. Please sign in first.');
          return;
        }

        await container.getTripService().create(
          tripName, 
          destinationId, 
          destination,
          description,
          new Date(startTime), 
          new Date(endTime), 
          currentUser.id
        );
      }

      navigation.navigate('Trips');

    } catch (error: any) {
      console.log('error', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={isEditMode ? t('trip_edit') : t('trip_add')}
        renderLeft={() => {
          return (
            <Icon
              name="times"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => navigation.goBack()}
      // onPressRight={() => navigation.goBack()}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            {/* Trip Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('trip_name')}</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  value={tripName}
                  onChangeText={(text: string) => {
                    setTripName(text);
                    if (touched.tripName) {
                      const error = validateField('tripName', text);
                      setFieldErrors({...fieldErrors, tripName: error});
                    }
                  }}
                  success={!touched.tripName || fieldErrors.tripName === ''}
                  onEndEditing={() => handleBlur('tripName')}
                />
                {tripName.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setTripName('');
                      setFieldErrors({...fieldErrors, tripName: ''});
                      setTouched({...touched, tripName: false});
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
              </View>
              {touched.tripName && fieldErrors.tripName !== '' && (
                <Text style={[styles.errorText, {color: colors.accent}]}>
                  {fieldErrors.tripName}
                </Text>
              )}
            </View>

            {/* Destination City */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('destination_city')}</Text>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity onPress={() => setCityModalVisible(true)} activeOpacity={0.7}>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    value={destination}
                    success={!touched.destination || fieldErrors.destination === ''}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {destination.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setDestination('');
                      setDestinationId('');
                      setFieldErrors({...fieldErrors, destination: ''});
                      setTouched({...touched, destination: false});
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
              </View>
              {touched.destination && fieldErrors.destination !== '' && (
                <Text style={[styles.errorText, {color: colors.accent}]}>
                  {fieldErrors.destination}
                </Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('description')}</Text>
              <View style={styles.descriptionContainer}>
                <TextInput
                  style={[styles.textInput, styles.descriptionInput]}
                  placeholder=""
                  value={description}
                  onChangeText={(text: string) => {
                    setDescription(text);
                    if (touched.description) {
                      const error = validateField('description', text);
                      setFieldErrors({...fieldErrors, description: error});
                    }
                  }}
                  onEndEditing={() => handleBlur('description')}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>
              {touched.description && fieldErrors.description !== '' && (
                <Text style={[styles.errorText, {color: colors.accent}]}>
                  {fieldErrors.description}
                </Text>
              )}
            </View>

            {/* Start Date */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('start_date')}</Text>
              <DatePicker
                key={`start-time-${resetKey}`}
                label=""
                selected={startTime}
                current={startTime || new Date().toISOString().slice(0, 10)}
                style={styles.datePickerContainer}
                onChange={(date: string) => {
                  setStartTime(date);
                  handleBlur('startTime');
                  // Re-validate endTime if it's already set
                  if (touched.endTime && endTime) {
                    const endError = validateField('endTime', endTime);
                    setFieldErrors({...fieldErrors, endTime: endError});
                  }
                }}
              />
              {touched.startTime && fieldErrors.startTime !== '' && (
                <Text style={[styles.errorText, {color: colors.accent}]}>
                  {fieldErrors.startTime}
                </Text>
              )}
            </View>

            {/* End Date */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('end_date')}</Text>
              <DatePicker
                key={`end-time-${resetKey}`}
                label=""
                selected={endTime}
                minDate={startTime}
                current={endTime || startTime || new Date().toISOString().slice(0, 10)}
                style={styles.datePickerContainer}
                onChange={(date: string) => {
                  setEndTime(date);
                  handleBlur('endTime');
                }}
              />
              {touched.endTime && fieldErrors.endTime !== '' && (
                <Text style={[styles.errorText, {color: colors.accent}]}>
                  {fieldErrors.endTime}
                </Text>
              )}
            </View>
            {/* Error Message */}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorMessage, {color: colors.accent}]}>
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Save/Update Button */}
            {loadingTrip ? (
              <Text style={{ marginTop: 20, textAlign: 'center' }}>
                Loading trip...
              </Text>
            ) : (
              <Button
                full
                style={[
                  styles.createButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: loading ? 0.6 : 1,
                  }
                ]}
                loading={loading}
                disabled={loading}
                onPress={() => onSaveTrip()}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  {isEditMode ? t('update_trip') : t('add_trip')}
                </Text>
              </Button>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* City Autocomplete Modal */}
        <AutocompleteModal
          visible={cityModalVisible}
          onClose={() => setCityModalVisible(false)}
          title={t('destination_city')}
          placeholder="Search for a city..."
          fetchOptions={searchCities}
          onSelect={handleCitySelect}
          debounceMs={300}
          minChars={3}
          testID="destination-city-autocomplete"
        />
      </SafeAreaView>
    </View>
  );
}

