import { ActivityIndicator, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Header, Icon, Image, Text, TextInput } from '@components';
import { useTranslation } from 'react-i18next';
import { Images, useTheme } from '@config';
import { container } from '@services';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setSelectedTrip } from '../../actions/trips';
import styles from './styles';
import Trip from '../../database/model/Trip';
import { seedFromCSV, clearAllData, clearAllDataPermanently } from '../../database/csvSeeder';
import TripItem from '../../components/TripItem';
import { MenuItem } from '../../components/PopupMenu';
import AuthService from '../../services/AuthService';

export default function Trips({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [syncing, setSyncing] = useState(false);

  const tripService = container.getTripService();
  const syncService = container.getSyncService();

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    const filtered = tripService.searchTrips(trips, text);
    setFilteredTrips(filtered);
  };

  const clearSearch = () => {
    setSearchText('');
    setFilteredTrips(trips);
  };

  const handleTripPress = (trip: Trip) => {
    dispatch(setSelectedTrip(trip));
    navigation.navigate('TripDetails');
  };

  const handleSeedFromCSV = async () => {
    try {
      // Get the current logged-in user's ID
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        Alert.alert(
          'Authentication Required',
          'Please log in first before seeding data.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      console.log(`📝 Seeding data for user: ${currentUser.email} (${currentUser.id})`);
      await seedFromCSV(currentUser.id);
      
      // Reload trips after seeding
      const tripsData = await tripService.getTrips();
      setTrips(tripsData);
      setUpcomingTrips(tripService.getUpcomingTrips(tripsData));
      setFilteredTrips(tripService.searchTrips(tripsData, searchText));
      
      Alert.alert(
        'Data Seeded',
        'Sample trips have been added to your account.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error seeding from CSV:', error);
      Alert.alert(
        'Seeding Failed',
        error instanceof Error ? error.message : 'Failed to seed data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearAllData = async () => {
    try {
      console.log('🧹 Starting clear all data...');
      
      // Step 1: Soft delete all records (marks as deleted, keeps for sync)
      console.log('📝 Step 1: Marking all records as deleted...');
      await clearAllData();
      
      // Clear UI state immediately
      setTrips([]);
      setUpcomingTrips([]);
      setFilteredTrips([]);
      setSearchText('');
      
      console.log('✅ Local data marked as deleted');
      console.log('📤 Step 2: Syncing deletions to server...');
      
      // Step 2: Trigger sync to push deletions to server
      await container.getSyncService().sync();
      
      console.log('✅ Sync completed - deletions sent to server');
      console.log('🗑️ Step 3: Permanently purging soft-deleted records...');
      
      // Step 3: Permanently destroy soft-deleted records (cleanup)
      await clearAllDataPermanently();
      
      console.log('✅ All data cleared and purged successfully');
      
      Alert.alert(
        'Data Cleared',
        'All trips and activities have been deleted locally, synced to the server, and purged. User account is preserved.\n\nLogging in from another device will now see an empty account.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      Alert.alert(
        'Clear Failed',
        error instanceof Error ? error.message : 'Failed to clear data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      console.log('🔄 Starting manual sync...');
      
      // Call sync service directly
      await syncService.sync();
      
      // Reload trips after sync to show any changes
      const tripsData = await tripService.getTrips();
      setTrips(tripsData);
      setUpcomingTrips(tripService.getUpcomingTrips(tripsData));
      setFilteredTrips(tripService.searchTrips(tripsData, searchText));
      
      Alert.alert(
        'Sync Complete',
        'Your trips have been synchronized with the server.',
        [{ text: 'OK' }]
      );
      
      console.log('✅ Manual sync completed successfully');
    } catch (error) {
      console.error('❌ Manual sync failed:', error);
      Alert.alert(
        'Sync Failed',
        error instanceof Error ? error.message : 'Failed to synchronize. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSyncing(false);
    }
  };

  const handlePushOnly = async () => {
    try {
      setSyncing(true);
      console.log('📤 Starting push-only sync (testing)...');
      
      // Cast to any to access pushOnly method (not in interface yet)
      const result = await (syncService as any).pushOnly();
      
      // Reload trips after push to show any changes
      const tripsData = await tripService.getTrips();
      setTrips(tripsData);
      setUpcomingTrips(tripService.getUpcomingTrips(tripsData));
      setFilteredTrips(tripService.searchTrips(tripsData, searchText));
      
      Alert.alert(
        'Push Complete',
        result?.message || 'Your local changes have been pushed to the server.',
        [{ text: 'OK' }]
      );
      
      console.log('✅ Push-only sync completed successfully');
    } catch (error) {
      console.error('❌ Push-only sync failed:', error);
      Alert.alert(
        'Push Failed',
        error instanceof Error ? error.message : 'Failed to push changes. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSyncing(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'add_trip',
      title: t('add_trip'),
      icon: 'plus',
      onPress: () => navigation.navigate('TripAdd'),
    },
    {
      id: 'sync',
      title: syncing ? 'Syncing...' : 'Sync Now',
      icon: 'sync',
      onPress: handleManualSync,
      disabled: syncing,
    },
    {
      id: 'push_only',
      title: syncing ? 'Pushing...' : 'Push Only (Test)',
      icon: 'upload',
      onPress: handlePushOnly,
      disabled: syncing,
    },
    {
      id: 'template_pages',
      title: t('template_pages'),
      icon: 'th-large',
      onPress: () => navigation.navigate('TemplatePages'),
    },
    {
      id: 'seed_csv',
      title: 'Seed from CSV',
      icon: 'database',
      onPress: handleSeedFromCSV,
    },
    {
      id: 'clear_all',
      title: 'Clear All Data',
      icon: 'trash-alt',
      onPress: handleClearAllData,
    }
  ];

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadTrips = async () => {
        try {
          setLoading(true);
          const tripsData = await tripService.getTrips();
          if (isActive) {
            setTrips(tripsData);
            setUpcomingTrips(tripService.getUpcomingTrips(tripsData));
            setFilteredTrips(tripService.searchTrips(tripsData, searchText));
          }
        } catch (error) {
          console.error("Error loading trips:", error);
        } finally {
          if (isActive) {
            setLoading(false); 
          }
        }
      };

      loadTrips();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Show search only if there are more than 5 trips
  const shouldShowSearch = trips.length > 5;

  return (
    <ScrollView style={{ padding: 0, backgroundColor: 'white' }}>
      <Header
        title={t('my_trips')}
        menuItems={menuItems}
      />

      {/* Search Section - Only visible if more than 5 trips */}
      {shouldShowSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              onChangeText={handleSearchChange}
              placeholder={t('search_trips_placeholder')}
              value={searchText}
              icon={
                searchText.length > 0 ? (
                  <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <Icon name="times" size={16} color={colors.gray} />
                  </TouchableOpacity>
                ) : (
                  <Icon name="search" size={16} color={colors.gray} />
                )
              }
            />
          </View>
          {searchText.length > 0 && (
            <View style={styles.searchResultsInfo}>
              <Text caption1 grayColor>
                {t('search_results_count', { count: filteredTrips.length, total: trips.length })}
              </Text>
            </View>
          )}
        </View>
      )}

      {filteredTrips.length == 0 && (
        <View style={{ marginTop: 40, marginBottom: 40, alignItems: 'center', paddingHorizontal: 20 }}>

          <Image source={Images.suitecase}  style={{width: 200, height: 300}}/>

          <Text title3 semibold style={{ marginTop: 40 }}>
            {searchText.length > 0 ? t('no_trips_found_search') : t('trips_empty_1')}
          </Text>
          <Text title3 semibold style={{ marginTop: 10 }}>
            {searchText.length > 0 ? t('try_different_search') : t('trips_empty_2')}
          </Text>
          <Button
            full
            style={{ marginTop: 20 }}
            loading={loading}
            onPress={() => navigation.navigate('TripAdd')}>
            {t('add_trip')}
          </Button>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      <View style={styles.tripListContainer}>
        {filteredTrips.map((trip: Trip) => (
          <TripItem
            key={trip.id}
            title={trip.name}
            destination={trip.destination}
            description={trip.description}
            startDate={trip.startTime}
            endDate={trip.endTime}
            isUpcoming={upcomingTrips.some(upcoming => upcoming.id === trip.id)}
            onPress={() => handleTripPress(trip)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
