import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, Text } from '@components';
import { useTheme } from '@config';
import styles from './styles';
import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------
// Static guide/blog data (replace with API data when available)
// ---------------------------------------------------------------------------
const BLOG_CARDS = [
  {
    id: 'itineraries',
    emoji: '📋',
    color: '#2d6ab4',
    title: 'Why Itineraries Make Trips Smoother',
    date: 'Oct 3 · Sony Hans',
  },
  {
    id: 'outdoors',
    emoji: '🌲',
    color: '#16a34a',
    title: 'Outdoor Trips for Non-Outdoor People',
    date: 'Oct 5 · Sony Hans',
  },
  {
    id: 'kids',
    emoji: '👨‍👩‍👧',
    color: '#d97706',
    title: 'Traveling with Kids: Yes You Can!',
    date: 'Oct 1 · Sony Hans',
  },
];

const ITINERARY_CARDS = [
  { id: 'orlando',   emoji: '🏰', color: '#3b82f6', title: 'Orlando',    duration: '8 days' },
  { id: 'alberta',   emoji: '🏔️', color: '#16a34a', title: 'Alberta',    duration: '10 days' },
  { id: 'ontario',   emoji: '🏙️', color: '#0ea5e9', title: 'Ontario',    duration: '8 days' },
  { id: 'eastcoast', emoji: '🌊', color: '#22c55e', title: 'East Coast', duration: '13 days' },
];

// ---------------------------------------------------------------------------
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NextTripCard({ trip, onPress }: any) {
  const filledDays = trip.filled_days ?? 0;
  const totalDays = trip.duration_days ?? 1;
  const progress = Math.min(1, filledDays / totalDays);

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.nextTripCard}>
      <View style={styles.ntCircle1} />
      <View style={styles.ntCircle2} />
      <Text style={styles.ntLabel}>NEXT TRIP</Text>
      <View style={styles.ntRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ntTitle} numberOfLines={2}>{trip.trip_name}</Text>
          <Text style={styles.ntDest}>📍 {trip.destination}</Text>
          <Text style={styles.ntDates}>{trip.start_date} – {trip.end_date}</Text>
        </View>
        <View style={styles.ntDaysBox}>
          <Text style={styles.ntDaysNum}>{trip.days_until ?? 14}</Text>
          <Text style={styles.ntDaysLbl}>days</Text>
        </View>
      </View>
      <View style={styles.ntProgressTrack}>
        <View style={[styles.ntProgressFill, { flex: progress }]} />
      </View>
      <View style={styles.ntProgressRow}>
        <Text style={styles.ntProgressLeft}>Itinerary progress</Text>
        <Text style={styles.ntProgressRight}>{filledDays} of {totalDays} days filled</Text>
      </View>
    </TouchableOpacity>
  );
}

function NoNextTrip({ colors, onPress }: any) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.nextTripCard}>
      <View style={styles.ntCircle1} />
      <View style={styles.ntCircle2} />
      <Text style={styles.ntLabel}>NEXT TRIP</Text>
      <View style={{ alignItems: 'center', paddingVertical: 10 }}>
        <Text style={{ fontSize: 36, marginBottom: 8 }}>✈️</Text>
        <Text style={styles.noTripTitle}>No upcoming trips yet</Text>
        <Text style={styles.noTripBody}>Tap to plan your first trip</Text>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function Home({ navigation }: any) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // TODO: replace with real trip data from store/API
  const nextTrip = {
    trip_name: 'Cruise to Bahamas',
    destination: 'Orlando, FL',
    start_date: 'Dec 15',
    end_date: 'Dec 20, 2025',
    duration_days: 6,
    filled_days: 3,
    days_until: 14,
  };

  // TODO: replace with real auth store
  const firstName = 'Homer';
  const initials = 'HJ';

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['right', 'left', 'top']}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={colors.primary} />
          }>

          {/* ── Header ── */}
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <View>
              <Text style={[styles.greetingLabel, { color: '#6b7280' }]}>{getGreeting()},</Text>
              <Text style={[styles.greetingName, { color: colors.text }]}>{firstName} 👋</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.85}
              style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Next Trip Card ── */}
          <View style={styles.cardPad}>
            {nextTrip
              ? <NextTripCard trip={nextTrip} onPress={() => navigation.navigate('TripDetails')} />
              : <NoNextTrip colors={colors} onPress={() => navigation.navigate('TripAdd')} />
            }
          </View>

          {/* ── Blogs & News ── */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Blogs &amp; News</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GuidesScreen')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={BLOG_CARDS}
            keyExtractor={i => i.id}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.blogCard}
                onPress={() => navigation.navigate('GuidesScreen')}
                activeOpacity={0.85}>
                <View style={[styles.blogCardImg, { backgroundColor: item.color }]}>
                  <Text style={styles.blogEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.blogCardBody}>
                  <Text style={[styles.blogTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.blogDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* ── Pre-Built Itineraries ── */}
          <View style={[styles.sectionHeader, { marginTop: 6 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pre-Built Itineraries</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GuidesScreen')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itnGrid}>
            {ITINERARY_CARDS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.itnCard}
                onPress={() => navigation.navigate('GuidesScreen')}
                activeOpacity={0.85}>
                <View style={[styles.itnCardImg, { backgroundColor: item.color }]}>
                  <Text style={styles.itnEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.itnCardBody}>
                  <Text style={[styles.itnTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={styles.itnDuration}>{item.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
