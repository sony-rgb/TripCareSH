import React, { useState } from 'react';
import { View, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { SafeAreaView, Header, Icon, TextInput, Button, DatePicker, Text, FlightItem } from '@components';
import { BaseStyle, useTheme, Images } from '@config';
import { container } from '@services';
import { API_BASE_URL } from '../../appConfig';
import { handleUnauthorizedError } from 'utils/unauthorizedHandler';

interface Airline {
  id: string;
  airline: string;
  iata: string;
  icao: string;
}

interface Airport {
  id: string;
  name: string;
  municipality: string;
  iataCode: string;
  icaoCode: string;
}

export interface FlightInfo {
  departureDateTime: string;
  departureTime: string;
  departureAirport: string;
  departureCity: string;
  departureTerminal: string;
  departureGate: string;
  arrivalTime: string;
  arrivalDateTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTerminal: string;
  arrivalGate: string;
  arrivalBaggage: string;
  flightDurationInMinutes: number;
}

export default function FlightAdd({ navigation, route }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const selectedTrip = useSelector((state: any) => state.trips.selectedTrip);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  // Helper function to format date to YYYY-MM-DD string
  const formatDateToString = (date: string | Date | undefined): string | undefined => {
    if (!date) return undefined;
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toISOString().slice(0, 10);
    } catch (error) {
      return undefined;
    }
  };

  // Get the selected date from route params (passed from TripCalendar)
  const routeSelectedDate = route?.params?.selectedDate;
  const initialDepartureDate = routeSelectedDate ? formatDateToString(routeSelectedDate) || '' : '';

  const [departureDate, setDepartureDate] = useState(initialDepartureDate);
  const [airline, setAirline] = useState('');
  const [departingAirport, setDepartingAirport] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlineObject, setAirlineObject] = useState<Airline | null>(null);
  const [airportObject, setAirportObject] = useState<Airport | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [airportSearchError, setAirportSearchError] = useState<string | null>(null);
  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null);
  const [hasValidFlightData, setHasValidFlightData] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [success, setSuccess] = useState({
    departureDate: true,
    airline: true,
    departingAirport: true,
    flightNumber: true,
  });
  const [resetKey, setResetKey] = useState(0);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Clear all fields when screen comes into focus, but preserve selected date from route
      const initialDate = route?.params?.selectedDate ? formatDateToString(route.params.selectedDate) || '' : '';
      setDepartureDate(initialDate);
      setAirline('');
      setDepartingAirport('');
      setFlightNumber('');
      setErrorMessage('');
      setAirlines([]);
      setAirports([]);
      setSearchError(null);
      setAirportSearchError(null);
      setFlightInfo(null);
      setHasValidFlightData(false);
      setResetKey(prev => prev + 1); // Force re-render of components with keys
      setSuccess({
        departureDate: true,
        airline: true,
        departingAirport: true,
        flightNumber: true,
      });
    }, [route?.params?.selectedDate])
  );

  const searchAirlines = async (searchTerm: string) => {
    console.log('🔍 Searching airlines for:', searchTerm);
    if (searchTerm.length < 2) {
      console.log('⏭️ Search term too short, skipping search');
      setAirlines([]);
      return;
    }

    try {
      setSearchError(null);
      const url = `${API_BASE_URL}/api/v1/airline/search?q=${encodeURIComponent(searchTerm)}`;
      console.log('🌐 Airline search URL:', url);
      
      const response = await container.getAuthService().authenticatedFetch(
        url,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${container.getAuthService().getAccessToken()}`
          }
        }
      );

      const data = await response.json();
      console.log('✅ Airline search results:', data.content?.length || data.length || 0, 'found');

      setAirlines(data.content || data); // Handle different response structures
    } catch (error) {
      if(handleUnauthorizedError(error, dispatch, navigation)) {
        return;
      }

      console.error('❌ Error fetching airlines:', error);
      setAirlines([]);
      setSearchError('Unable to fetch airlines. Please check your connection.');
    }
  };

  const searchAirports = async (searchTerm: string) => {
    console.log('🔍 Searching airports for:', searchTerm);
    if (searchTerm.length < 2) {
      console.log('⏭️ Search term too short, skipping search');
      setAirports([]);
      return;
    }

    try {
      setAirportSearchError(null);
      const url = `${API_BASE_URL}/api/v1/airport/search?q=${encodeURIComponent(searchTerm)}`;
      console.log('🌐 Airport search URL:', url);
      
      const response = await container.getAuthService().authenticatedFetch(
        url,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${container.getAuthService().getAccessToken()}`
          }
        }
      );

      const data = await response.json();
      console.log('✅ Airport search results:', data.content?.length || data.length || 0, 'found');

      setAirports(data.content || data); // Handle different response structures
    } catch (error) {
      if(handleUnauthorizedError(error, dispatch, navigation)) {
        return;
      }

      console.error('❌ Error fetching airports:', error);
      setAirports([]);
      setAirportSearchError('Unable to fetch airports. Please check your connection.');
    }
  };

  const onAirlineSelect = (item: any) => {
    console.log('✈️ Airline selected:', item.airline, `(${item.iata})`);
    setAirline(item.airline);
    setAirlineObject({
      id: item.id,
      airline: item.airline,
      iata: item.iata,
      icao: item.icao
    });
    setAirlines([]);
    console.log('✅ Airline object set');
  };

  const onAirportSelect = (item: any) => {
    console.log('🛬 Airport selected:', item.name, `(${item.iataCode})`);
    setDepartingAirport(`${item.name} (${item.iataCode})`);
    setAirportObject({
      id: item.id,
      name: item.name,
      municipality: item.municipality,
      iataCode: item.iataCode,
      icaoCode: item.icaoCode
    });
    setAirports([]);
    console.log('✅ Airport object set');
  };

  const onSearchFlight = async () => {
    console.log('🔍 onSearchFlight called');
    console.log('📋 Current form values:', {
      departureDate,
      departingAirport,
      airportObject: airportObject ? 'SET' : 'NULL',
      airline,
      airlineObject: airlineObject ? 'SET' : 'NULL',
      flightNumber
    });

    setSuccess({
      departureDate: true,
      airline: true,
      departingAirport: true,
      flightNumber: true,
    });
    
    if (departureDate === '' ||
      departingAirport === '' ||
      airportObject === null ||
      airline === '' ||
      airlineObject === null ||
      flightNumber === '') {
      console.log('❌ Validation failed');
      setSuccess({
        ...success,
        departureDate: departureDate !== '',
        departingAirport: departingAirport !== '',
        airline: airline !== '',
        flightNumber: flightNumber !== ''
      });
      let emptyFields = [];
      if (departureDate === '') {
        emptyFields.push('Departure Date');
      }
      if (departingAirport === '' || airportObject === null) {
        emptyFields.push('Departing Airport');
      }
      if (airline === '' || airlineObject === null) {
        emptyFields.push('Airline');
      }
      if (flightNumber === '') {
        emptyFields.push('Flight Number');
      }

      const errorMsg = `${emptyFields.join(', ')} ${emptyFields.length > 1 ? 'are' : 'is'} required`;
      console.log('❌ Validation error:', errorMsg);
      setErrorMessage(errorMsg);
      return;
    }
    
    if(isNaN(Number(flightNumber))) {
      console.log('❌ Flight number is not a number');
      setErrorMessage('Flight Number must be a number');
      return;
    }

    console.log('✅ Validation passed, proceeding with API call');

    try {
      setIsCooldown(true);
      setLoading(true);
      setErrorMessage('');
      setFlightInfo(null);
      setHasValidFlightData(false);

      console.log('👤 Checking current user...');
      const currentUser = await container.getAuthService().getCurrentUser();
      if (!currentUser) {
        console.log('❌ No current user, redirecting to sign in');
        navigation.navigate('SignIn');
        return;
      }
      console.log('✅ Current user authenticated');

      // Prepare API request parameters
      const params = new URLSearchParams({
        departureDate: departureDate,
        departureAirportIata: airportObject.iataCode,
        airlineIata: airlineObject.iata,
        flightNumber: flightNumber
      });

      const requestUrl = `${API_BASE_URL}/api/v1/flight/schedule?${params.toString()}`;
      console.log('🌐 Making API request to:', requestUrl);
      console.log('📤 Request params:', {
        departureDate,
        departureAirportIata: airportObject.iataCode,
        airlineIata: airlineObject.iata,
        flightNumber
      });

      // Call the flight schedule API with authentication
      const response = await container.getAuthService().authenticatedFetch(
        requestUrl,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${container.getAuthService().getAccessToken()}`
          }
        }
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ API Error Response:', JSON.stringify(errorData, null, 2));
        const errorMessage = 
          errorData.error ? errorData.error : errorData.error?.details || 
          errorData.error?.message || 
          errorData.error?.message || 
          errorData.message || 
          'Failed to fetch flight information';
        throw new Error(errorMessage);
      }

      const flightResponse = await response.json();
      console.log('✅ API Success Response:', JSON.stringify(flightResponse, null, 2));

      if (flightResponse) {
        // Convert date strings to Date objects for consistency
        const flightData: FlightInfo = {
          departureDateTime: flightResponse.departureInfo?.scheduledDateTime ?? '',
          departureTime: flightResponse.departureInfo?.scheduledTime ?? '',
          departureAirport: flightResponse.departureInfo?.iataCode ?? '',
          departureCity: flightResponse.departureInfo?.municipality ?? '',
          departureTerminal: flightResponse.departureInfo?.terminal ?? '',
          departureGate: flightResponse.departureInfo?.gate ?? '',
          arrivalDateTime: flightResponse.arrivalInfo?.scheduledDateTime ?? '',
          arrivalTime: flightResponse.arrivalInfo?.scheduledTime ?? '',
          arrivalAirport: flightResponse.arrivalInfo?.iataCode ?? '',
          arrivalCity: flightResponse.arrivalInfo?.municipality ?? '',
          arrivalTerminal: flightResponse.arrivalInfo?.terminal ?? '',
          arrivalGate: flightResponse.arrivalInfo?.gate ?? '',
          arrivalBaggage: flightResponse.arrivalInfo?.baggage ?? '',
          flightDurationInMinutes: flightResponse.flightInfo?.duration ?? 0
        };

        console.log('✅ Flight data parsed successfully');
        setFlightInfo(flightData);
        setHasValidFlightData(true);
        setErrorMessage('');
      } else {
        console.log('❌ No flight response data');
        throw new Error('Flight not found');
      }

    } catch (error: any) {
      if(handleUnauthorizedError(error, dispatch, navigation)) {
        console.log('⚠️ Unauthorized error, handled by error handler');
        return;
      }
      
      console.log('❌ Flight search error:', error);
      console.log('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setErrorMessage(error.message || 'Failed to fetch flight information');
      setFlightInfo(null);
      setHasValidFlightData(false);
    } finally {
      console.log('🏁 Search completed');
      setLoading(false);
      setTimeout(() => setIsCooldown(false), 2000);
    }
  }

  const minutesToHoursDecimal = (minutes: number): number => Number((minutes / 60).toFixed(1));

  const onAddToTrip = async () => {
    if (!hasValidFlightData || !flightInfo || !selectedTrip) {
      setErrorMessage(!selectedTrip ? 'No trip selected. Please go back and select a trip first.' : 'Please search for flight information first');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      // Create Flight with TripItem in one operation
      const result = await container.getFlightService().createFlightWithTripItem(
        selectedTrip.id,
        selectedTrip.userId,
        flightInfo,
        airline,
        flightNumber
      );
      
      if (!result) {
        throw new Error('Failed to create flight and trip item');
      }

      const { tripItem } = result;

      console.log('Successfully saved flight to trip:', selectedTrip.name);
      
      // Navigate back with success
      navigation.goBack();

    } catch (error: any) {
      console.error('Error saving flight:', error);
      setErrorMessage(error.message || 'Failed to save flight. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={'Add Flight'}
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
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <View style={[styles.container, { flex: 0 }]}>
            
            {/* Trip Selection Info */}
            {selectedTrip ? (
              <View style={{ backgroundColor: colors.card, padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                <Text body2 style={{ color: colors.primary, fontWeight: '600' }}>
                  Adding flight to: {selectedTrip.name}
                </Text>
                <Text caption1 style={{ color: colors.gray, marginTop: 2 }}>
                  {selectedTrip.destination} • {new Date(selectedTrip.startTime).toLocaleDateString()} - {new Date(selectedTrip.endTime).toLocaleDateString()}
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: colors.accent + '20', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.accent }}>
                <Text body2 style={{ color: colors.accent, fontWeight: '600' }}>
                  No trip selected
                </Text>
                <Text caption1 style={{ color: colors.accent, marginTop: 2 }}>
                  Please go back and select a trip first
                </Text>
              </View>
            )}

            <DatePicker
              key={`departure-date-${resetKey}`}
              label={'Departure Date *'}
              selected={departureDate}
              minDate={formatDateToString(selectedTrip?.startTime)}
              maxDate={formatDateToString(selectedTrip?.endTime)}
              current={departureDate || formatDateToString(selectedTrip?.startTime) || new Date().toISOString().slice(0, 10)}
              style={styles.textInput}
              onChange={(date: string) => setDepartureDate(date)}
              success={success.departureDate}
              onEndEditing={() => {
                setSuccess(prev => ({
                  ...prev,
                  departureDate: departureDate !== ''
                }));
              }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Departing Airport *'}
              value={departingAirport}
              onChangeText={(text: string) => {
                setDepartingAirport(text);
                setAirportObject(null);
                searchAirports(text);
              }}
              success={success.departingAirport}
              onBlur={() => {
                // Delay closing to allow selection from dropdown
                setTimeout(() => {
                  setAirports([]);
                }, 200);
                setSuccess(prev => ({
                  ...prev,
                  departingAirport: departingAirport !== ''
                }));
              }}
            />

            {airportSearchError && (
              <Text style={{ ...styles.errorText, color: colors.accent }}>
                {airportSearchError}
              </Text>
            )}

            {airports.length > 0 && (
              <View style={styles.airlinesList}>
                {
                  airports.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.lineInformation,
                          { borderBottomColor: colors.border }
                        ]}
                        key={index}
                        onPress={() => {
                          onAirportSelect(item);
                          setSuccess(prev => ({
                            ...prev,
                            departingAirport: departingAirport !== ''
                          }));
                        }}
                      >
                        <Text body2 grayColor>
                          {item.name} ({item.iataCode}) - {item.municipality}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            )}

            <TextInput
              style={styles.textInput}
              placeholder={'Airline *'}
              value={airline}
              onChangeText={(text: string) => {
                setAirline(text);
                setAirlineObject(null);
                searchAirlines(text);
              }}
              success={success.airline}
              onBlur={() => {
                // Delay closing to allow selection from dropdown
                setTimeout(() => {
                  setAirlines([]);
                }, 200);
                setSuccess(prev => ({
                  ...prev,
                  airline: airline !== ''
                }));
              }}
            />

            {searchError && (
              <Text style={{ ...styles.errorText, color: colors.accent }}>
                {searchError}
              </Text>
            )}

            {airlines.length > 0 && (
              <View style={styles.airlinesList}>
                {
                  airlines.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.lineInformation,
                          { borderBottomColor: colors.border }
                        ]}
                        key={index}
                        onPress={() => {
                          onAirlineSelect(item);
                          setSuccess(prev => ({
                            ...prev,
                            airline: airline !== ''
                          }));
                        }}
                      >
                        <Text body2 grayColor>
                          {item.airline} {item.iata ? `(${item.iata})` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            )}

            <View style={styles.searchRow}>
              <TextInput
                style={styles.flightNumberInput}
                keyboardType="numeric"
                placeholder={'Flight Number *'}
                value={flightNumber}
                onChangeText={(text: string) => setFlightNumber(text)}
                success={success.flightNumber}
                onEndEditing={() => {
                  setSuccess(prev => ({
                    ...prev,
                    flightNumber: flightNumber !== ''
                  }));
                }}
              />
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: isCooldown ? 'grey' : colors.primary }]}
                onPress={loading || isCooldown ? undefined : () => {
                  console.log('🔘 Search button pressed');
                  onSearchFlight();
                }}
                activeOpacity={loading || isCooldown ? 1 : 0.7}>
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Icon name="search" size={18} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {errorMessage && (
              <Text style={{ color: colors.accent, marginTop: 10 }}>
                {errorMessage}
              </Text>
            )}
          </View>
          {(hasValidFlightData && flightInfo) && (
            <ScrollView style={[styles.flightInfoContainer, { flex: 0, maxHeight: 400 }]}>
              <FlightItem
                style={{marginBottom: 10, marginHorizontal: 20}}
                from={{
                  name: flightInfo.departureCity,
                  value: flightInfo.departureAirport,
                  image: '',
                  hour: flightInfo.departureTime
                }}
                to={{
                  name: flightInfo.arrivalCity,
                  value: flightInfo.arrivalAirport,
                  image: '',
                  hour: flightInfo.arrivalTime
                }}
                brand={''}
                image='' //TODO: Add airline logo
                type={''}
                price={''}
                route=''
                totalHour={minutesToHoursDecimal(flightInfo.flightDurationInMinutes)}
              />

              <Button
                full
                style={styles.addToTripButton}
                loading={saving}
                onPress={onAddToTrip}>
                {saving ? 'Saving...' : `Add to ${selectedTrip ? selectedTrip.name : 'Trip'}`}
              </Button>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
