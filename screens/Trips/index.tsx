import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView, Text, Icon, TextInput } from '@components';
import { useTheme } from '@config';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { container } from '@services';
import { setSelectedTrip } from '../../actions/trips';
import { seedFromCSV, clearAllData, clearAllDataPermanently } from '../../database/csvSeeder';
import AuthService from '../../services/AuthService';
import Trip from '../../database/model/Trip';
import styles from './styles';

// ── Trip logo (TripCare polygon mark) ────────────────────────────────────────
// Uses react-native-svg for crisp vector rendering matching the prototype
import Svg, { Polygon } from 'react-native-svg';

function TripLogo({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      {/* Full kite shape — light blue */}
      <Polygon
        points="20,4 34,34 20,26 6,34"
        fill="#4AABDB"
        stroke="#1a1a2e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right half — darker blue for depth */}
      <Polygon
        points="20,4 34,34 20,26"
        fill="#2E8FB8"
        stroke="#1a1a2e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Owned trip card ───────────────────────────────────────────────────────────
function OwnedTripCard({ trip, onPress, onShare, onDelete, colors }: any) {
  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };
  const getDuration = (start: any, end: any) => {
    if (!start || !end) return '';
    const s = new Date(start), e = new Date(end);
    const diff = Math.floor(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff === 1 ? '1 day' : `${diff} days`;
  };

  return (
    <View style={[styles.tripCard, { borderColor: colors.primary }]}>
      <TouchableOpacity
        style={styles.tripCardMain}
        onPress={onPress}
        activeOpacity={0.85}>
        {/* TripCare polygon mark */}
        <TripLogo size={36} />
        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.tripName, { color: colors.text }]} numberOfLines={1}>
            {trip.name}
          </Text>
          <Text style={styles.tripDest} numberOfLines={1}>
            {trip.destination}
          </Text>
        </View>
        {/* Meta */}
        <View style={styles.tripMeta}>
          <Text style={styles.tripDate}>{formatDate(trip.startTime)}</Text>
          <Text style={[styles.tripDays, { color: colors.text }]}>
            {getDuration(trip.startTime, trip.endTime)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action strip */}
      <View style={[styles.tripActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.tripActionBtn} onPress={onShare}>
          <Icon name="share-alt" size={13} color={colors.primary} />
          <Text style={[styles.tripActionTxt, { color: colors.primary }]}>Share</Text>
        </TouchableOpacity>
        <View style={[styles.actionDivider, { backgroundColor: colors.border }]} />
        <TouchableOpacity style={styles.tripActionBtn} onPress={onDelete}>
          <Icon name="trash-alt" size={13} color="#ef4444" />
          <Text style={[styles.tripActionTxt, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Shared trip card ──────────────────────────────────────────────────────────
function SharedTripCard({ trip, onPress, onLeave, colors }: any) {
  const isEdit = trip.permission === 'edit';
  const badgeBg  = isEdit ? '#d1fae5' : '#ede9fe';
  const badgeTxt = isEdit ? '#065f46' : '#4c1d95';
  const accentColor = isEdit ? '#059669' : '#7c3aed';
  const stripBg  = isEdit ? '#f0fdf4' : '#faf5ff';
  const stripBorder = isEdit ? '#d1fae5' : '#ede9fe';
  const iconBg   = isEdit ? '#d1fae5' : '#ede9fe';

  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };
  const getDuration = (start: any, end: any) => {
    if (!start || !end) return '';
    const s = new Date(start), e = new Date(end);
    const diff = Math.floor(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff === 1 ? '1 day' : `${diff} days`;
  };

  return (
    <View style={[styles.tripCard, { borderColor: accentColor }]}>
      <TouchableOpacity style={styles.tripCardMain} onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.tripIcon, { backgroundColor: iconBg }]}>
          <Text style={{ fontSize: 18 }}>🔗</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Text style={[styles.tripName, { color: colors.text }]} numberOfLines={1}>
              {trip.name}
            </Text>
            <View style={[styles.permBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.permBadgeTxt, { color: badgeTxt }]}>
                {isEdit ? 'EDIT' : 'VIEW'}
              </Text>
            </View>
          </View>
          <Text style={[styles.tripDest, { color: accentColor }]} numberOfLines={1}>
            {trip.sharedBy ? `Shared by ${trip.sharedBy} · ` : ''}{trip.destination}
          </Text>
        </View>
        <View style={styles.tripMeta}>
          <Text style={styles.tripDate}>{formatDate(trip.startTime)}</Text>
          <Text style={[styles.tripDays, { color: colors.text }]}>
            {getDuration(trip.startTime, trip.endTime)}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.tripActions, { borderTopColor: stripBorder, backgroundColor: stripBg }]}>
        <TouchableOpacity style={styles.tripActionBtn} onPress={onPress}>
          <Text style={[styles.tripActionTxt, { color: accentColor }]}>
            {isEdit ? '✏️ Can Edit' : '👁 View Only'}
          </Text>
        </TouchableOpacity>
        <View style={[styles.actionDivider, { backgroundColor: stripBorder }]} />
        <TouchableOpacity style={styles.tripActionBtn} onPress={onLeave}>
          <Text style={[styles.tripActionTxt, { color: '#ef4444' }]}>Leave Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Add/Join bottom sheet ─────────────────────────────────────────────────────
function AddTripSheet({ visible, onClose, onCreateNew, onJoin, onImport, colors }: any) {
  const options = [
    {
      label: 'Create a New Trip',
      sub: 'Start planning from scratch',
      icon: 'plus',
      bg: '#EAF5FB',
      iconBg: '#4AABDB',
      border: '#D6EEF8',
      onPress: onCreateNew,
    },
    {
      label: 'Join a Shared Trip',
      sub: 'Enter a TC-XXXXXXX trip code',
      icon: 'share-alt',
      bg: '#f5f3ff',
      iconBg: '#7c3aed',
      border: '#ddd6fe',
      onPress: onJoin,
    },
    {
      label: 'Import from Excel / Google Sheets',
      sub: 'Build a trip from a spreadsheet',
      icon: 'upload',
      bg: '#f0fdf4',
      iconBg: '#059669',
      border: '#bbf7d0',
      onPress: onImport,
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: '#fff' }]} onPress={() => {}}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.sheetTitle, { color: colors.text }]}>Add or Join a Trip</Text>
          {options.map(o => (
            <TouchableOpacity
              key={o.label}
              style={[styles.sheetOption, { backgroundColor: o.bg, borderColor: o.border }]}
              onPress={() => { onClose(); o.onPress(); }}
              activeOpacity={0.85}>
              <View style={[styles.sheetOptionIcon, { backgroundColor: o.iconBg }]}>
                <Icon name={o.icon} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sheetOptionLabel, { color: colors.text }]}>{o.label}</Text>
                <Text style={styles.sheetOptionSub}>{o.sub}</Text>
              </View>
              <Icon name="chevron-right" size={16} color="#9ca3af" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.sheetCancel, { backgroundColor: '#EAF5FB' }]}
            onPress={onClose}>
            <Text style={[styles.sheetCancelTxt, { color: '#6b7280' }]}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Delete / Leave confirm sheet ──────────────────────────────────────────────
function ConfirmSheet({ visible, onClose, onConfirm, title, message, emoji, confirmLabel, confirmColor }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: '#fff' }]} onPress={() => {}}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 }}>{title}</Text>
            <Text style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 19 }}>{message}</Text>
          </View>
          <TouchableOpacity
            style={[styles.sheetConfirmBtn, { backgroundColor: confirmColor ?? '#ef4444' }]}
            onPress={() => { onClose(); onConfirm(); }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{confirmLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetCancel, { backgroundColor: '#EAF5FB' }]}
            onPress={onClose}>
            <Text style={[styles.sheetCancelTxt, { color: '#6b7280' }]}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Trips({ navigation }: any) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [addSheetVisible, setAddSheetVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const tripService = container.getTripService();
  const syncService = container.getSyncService();

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setFilteredTrips(tripService.searchTrips(trips, text));
  };

  const handleTripPress = (trip: Trip) => {
    dispatch(setSelectedTrip(trip));
    navigation.navigate('TripDetails');
  };

  const handleDeleteTrip = async (trip: Trip) => {
    // Placeholder — wire real delete action here
    Alert.alert('Deleted', `"${trip.name}" moved to Trash.`);
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      await syncService.sync();
      const data = await tripService.getTrips();
      setTrips(data);
      setUpcomingTrips(tripService.getUpcomingTrips(data));
      setFilteredTrips(tripService.searchTrips(data, searchText));
    } catch (e) {
      Alert.alert('Sync Failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        try {
          setLoading(true);
          const data = await tripService.getTrips();
          if (active) {
            setTrips(data);
            setUpcomingTrips(tripService.getUpcomingTrips(data));
            setFilteredTrips(tripService.searchTrips(data, searchText));
          }
        } catch (e) {
          console.error('Error loading trips:', e);
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => { active = false; };
    }, []),
  );

  const showSearch = trips.length > 5;

  // Split owned vs shared (shared trips have a sharedBy field)
  const ownedTrips = filteredTrips.filter((t: any) => !t.sharedBy);
  const sharedTrips = filteredTrips.filter((t: any) => !!t.sharedBy);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, { backgroundColor: '#EAF5FB', borderBottomColor: '#D6EEF8' }]}>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>My Trips</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setAddSheetVisible(true)}
          activeOpacity={0.85}>
          <Icon name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Search bar — only when there are 5+ trips */}
        {showSearch && (
          <View style={styles.searchWrap}>
            <View style={[styles.searchBar, { backgroundColor: '#EAF5FB', borderColor: '#D6EEF8' }]}>
              <Icon name="search" size={16} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search trips by name or destination"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={handleSearchChange}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => handleSearchChange('')}>
                  <Icon name="times-circle" size={16} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {loading && (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        )}

        {/* Empty state */}
        {!loading && filteredTrips.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🧳</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {searchText ? 'No trips found' : 'No trips yet'}
            </Text>
            <Text style={styles.emptySub}>
              {searchText ? 'Try a different search term' : 'Tap + to plan your first adventure'}
            </Text>
            {!searchText && (
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
                onPress={() => setAddSheetVisible(true)}>
                <Text style={styles.emptyBtnTxt}>Plan a Trip</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Owned trips */}
        {ownedTrips.length > 0 && (
          <>
            {ownedTrips.map((trip: Trip) => (
              <OwnedTripCard
                key={trip.id}
                trip={trip}
                colors={colors}
                onPress={() => handleTripPress(trip)}
                onShare={() => navigation.navigate('ShareTrip', { tripId: trip.id })}
                onDelete={() => setDeleteTarget(trip.name)}
              />
            ))}
          </>
        )}

        {/* Shared with me section */}
        {sharedTrips.length > 0 && (
          <>
            <View style={styles.sectionLabel}>
              <Text style={[styles.sectionLabelTxt, { color: colors.text }]}>Shared with Me</Text>
              <Text style={styles.sectionLabelCount}>{sharedTrips.length} trip{sharedTrips.length !== 1 ? 's' : ''}</Text>
            </View>
            {sharedTrips.map((trip: any) => (
              <SharedTripCard
                key={trip.id}
                trip={trip}
                colors={colors}
                onPress={() => handleTripPress(trip)}
                onLeave={() => setLeaveTarget(trip.name)}
              />
            ))}
          </>
        )}

        {/* Add trip dashed button */}
        {!loading && (
          <TouchableOpacity
            style={[styles.addDashed, { borderColor: colors.primary, backgroundColor: '#EAF5FB' }]}
            onPress={() => setAddSheetVisible(true)}
            activeOpacity={0.8}>
            <Icon name="plus" size={19} color={colors.primary} />
            <Text style={[styles.addDashedTxt, { color: colors.primary }]}>Add New Trip</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ── Add / Join Sheet ── */}
      <AddTripSheet
        visible={addSheetVisible}
        onClose={() => setAddSheetVisible(false)}
        onCreateNew={() => navigation.navigate('TripAdd')}
        onJoin={() => navigation.navigate('JoinTrip')}
        onImport={() => Alert.alert('Coming Soon', 'Excel / Google Sheets import is coming soon.')}
        colors={colors}
      />

      {/* ── Delete Confirm ── */}
      <ConfirmSheet
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && Alert.alert('Moved to Trash', `"${deleteTarget}" will be deleted in 30 days.`)}
        emoji="🗑️"
        title="Delete Trip?"
        message={`This will move the trip to Trash. You have 30 days to recover it before it's permanently deleted.`}
        confirmLabel="Move to Trash"
      />

      {/* ── Leave Confirm ── */}
      <ConfirmSheet
        visible={!!leaveTarget}
        onClose={() => setLeaveTarget(null)}
        onConfirm={() => leaveTarget && Alert.alert('Left Trip', `You have left "${leaveTarget}".`)}
        emoji="👋"
        title="Leave Trip?"
        message="You will lose access to this shared trip. You can re-join using the trip code if the owner shares it again."
        confirmLabel="Leave Trip"
      />
    </SafeAreaView>
  );
}
