import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView, Text, Icon } from '@components';
import { useTheme } from '@config';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { container } from '../../services/container';
import Itinerary from '../../components/Itinerary';
import styles from './styles';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateRange(start: any, end: any): string {
  if (!start || !end) return '';
  const fmt = (d: any) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatShortRange(start: any, end: any): string {
  if (!start || !end) return '';
  const s = start instanceof Date ? start : new Date(start);
  const e = end instanceof Date ? end : new Date(end);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  return `${fmt(s)} – ${fmt(e)}`;
}

function getDuration(start: any, end: any): string {
  if (!start || !end) return '';
  const s = start instanceof Date ? start : new Date(start);
  const e = end instanceof Date ? end : new Date(end);
  const diff = Math.floor(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff === 1 ? '1 day' : `${diff} days`;
}

function generateDays(start: any, end: any) {
  if (!start || !end) return [];
  const days = [];
  const cur = new Date(start instanceof Date ? start : new Date(start));
  const endDate = end instanceof Date ? end : new Date(end);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  while (cur <= endDate) {
    const key = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
    days.push({
      date: new Date(cur),
      dayName: cur.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      dayNum: cur.getDate(),
      isToday: key === todayKey,
      key,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

// ── Add Item Modal ─────────────────────────────────────────────────────────────

const ADD_OPTIONS = [
  { label: 'Flight',      icon: 'plane',     bg: '#dbeafe', iconColor: '#3b82f6', route: 'FlightAdd'    },
  { label: 'Lodging',     icon: 'bed',       bg: '#fef3c7', iconColor: '#d97706', route: 'HotelAdd'     },
  { label: 'Car Rental',  icon: 'car-alt',   bg: '#d1fae5', iconColor: '#10b981', route: 'CarAdd'       },
  { label: 'Activity',    icon: 'star',      bg: '#ede9fe', iconColor: '#7c3aed', route: 'ActivityAdd'  },
];

function AddItemModal({ visible, onClose, onSelect, colors }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles2.overlay} onPress={onClose}>
        <Pressable style={styles2.sheet} onPress={() => {}}>
          <View style={styles2.handle} />
          <Text style={[styles2.sheetTitle, { color: colors.text }]}>
            What would you like to add?
          </Text>
          <View style={styles2.optGrid}>
            {ADD_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.label}
                style={[styles2.opt, { backgroundColor: opt.bg }]}
                onPress={() => { onClose(); onSelect(opt); }}
                activeOpacity={0.85}>
                <View style={[styles2.optIcon, { backgroundColor: opt.bg }]}>
                  <Icon name={opt.icon} size={24} color={opt.iconColor} />
                </View>
                <Text style={[styles2.optLabel, { color: colors.text }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles2.cancel, { backgroundColor: '#EAF5FB' }]} onPress={onClose}>
            <Text style={styles2.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// inline styles for the modal (kept separate to avoid polluting main stylesheet)
const styles2 = {
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' as const },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, paddingBottom: 36 },
  handle: { width: 36, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center' as const, marginBottom: 12 },
  sheetTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 14, textAlign: 'center' as const },
  optGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 9 },
  opt: { width: '47%' as any, borderRadius: 13, padding: 13, paddingHorizontal: 11, alignItems: 'center' as const, gap: 6 },
  optIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center' as const, justifyContent: 'center' as const },
  optLabel: { fontSize: 13, fontWeight: '500' as const },
  cancel: { marginTop: 11, borderRadius: 26, paddingVertical: 12, alignItems: 'center' as const },
  cancelTxt: { fontSize: 14, fontWeight: '600' as const, color: '#6b7280' },
};

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function TripDetails({ navigation }: any) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const selectedTrip = useSelector((state: any) => state.trips.selectedTrip);

  const [tripItems, setTripItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTripInfo, setShowTripInfo] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const days = selectedTrip
    ? generateDays(selectedTrip.startTime, selectedTrip.endTime)
    : [];

  // Build set of day keys that have items
  const daysWithItems = new Set(
    tripItems
      .filter(i => i.startDate)
      .map(i => {
        const d = new Date(i.startDate);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
  );

  const fetchItems = useCallback(async () => {
    if (!selectedTrip) return;
    try {
      setLoading(true);
      const items = await container.getTripItemService().getTripItems(selectedTrip.id);
      setTripItems(items);
      // default to first day
      if (!selectedDate && days.length > 0) setSelectedDate(days[0].date);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedTrip]);

  useFocusEffect(useCallback(() => { fetchItems(); }, [fetchItems]));

  // Items for the currently selected day
  const dayItems = selectedDate
    ? tripItems.filter(item => {
        if (!item.startDate) return false;
        const s = new Date(item.startDate);
        const e = item.endDate ? new Date(item.endDate) : s;
        const sel = selectedDate;
        const selKey = `${sel.getFullYear()}-${sel.getMonth()}-${sel.getDate()}`;
        const sKey = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`;
        const eKey = `${e.getFullYear()}-${e.getMonth()}-${e.getDate()}`;
        return selKey >= sKey && selKey <= eKey;
      }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    : [];

  const itineraryItems = dayItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    startDate: item.startDate,
    endDate: item.endDate,
    startTime: item.startTime,
    endTime: item.endTime,
    location: item.venue || item.address || item.location || '',
    icon: item.icon || 'calendar-alt',
    type: item.type,
    isCompleted: item.isCompleted ?? false,
  }));

  const handleEditItem = (item: any) => {
    if (item.type === 'activity') navigation.navigate('ActivityEdit', { tripItemId: item.id });
    else if (item.type === 'flight') navigation.navigate('FlightAdd', { tripItemId: item.id });
  };

  const handleAddSelect = (opt: any) => {
    navigation.navigate(opt.route, { selectedDate });
  };

  const itineraryDayLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : 'Itinerary';

  // ── No trip guard ─────────────────────────────────────────────────────────
  if (!selectedTrip) {
    return (
      <SafeAreaView style={[styles.container]} edges={['top', 'left', 'right']}>
        <View style={styles.noTripContainer}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🧳</Text>
          <Text style={[styles.noTripText, { color: colors.text, fontSize: 17, fontWeight: '600' }]}>
            No trip selected
          </Text>
          <Text style={[styles.noTripSubtext, { color: '#6b7280', fontSize: 13 }]}>
            Go back and tap a trip to view its details.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>

      {/* ── Top Bar ── */}
      <View style={[styles.topBar, { backgroundColor: '#EAF5FB', borderBottomColor: '#D6EEF8' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Icon name="chevron-left" size={17} color="#4AABDB" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle} numberOfLines={1}>{selectedTrip.name}</Text>
          <View style={styles.topBarBadgeRow}>
            <TouchableOpacity
              style={styles.sharedBadge}
              onPress={() => navigation.navigate('ShareTrip', { tripId: selectedTrip.id })}>
              <Text style={styles.sharedBadgeTxt}>⚡ 2 shared</Text>
            </TouchableOpacity>
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeTxt}>Owner</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ShareTrip', { tripId: selectedTrip.id })}>
          <Text style={[styles.menuBtn, { color: '#6b7280' }]}>···</Text>
        </TouchableOpacity>
      </View>

      {/* ── Collapsible Date Strip ── */}
      <TouchableOpacity
        style={[styles.dateStrip, { backgroundColor: '#EAF5FB', borderBottomColor: '#e5e7eb' }]}
        onPress={() => setShowTripInfo(!showTripInfo)}
        activeOpacity={0.75}>
        <Text style={styles.dateStripLabel}>
          {formatShortRange(selectedTrip.startTime, selectedTrip.endTime)}
        </Text>
        <Icon name={showTripInfo ? 'chevron-up' : 'chevron-down'} size={16} color="#6b7280" />
      </TouchableOpacity>

      {/* ── Expanded Trip Info ── */}
      {showTripInfo && (
        <View style={[styles.tripInfoBox, { backgroundColor: '#EAF5FB', borderBottomColor: '#e5e7eb' }]}>
          {selectedTrip.destination ? (
            <Text style={styles.tripInfoTitle}>{selectedTrip.destination}</Text>
          ) : null}
          <Text style={styles.tripInfoRow}>
            <Text style={{ fontWeight: '600' }}>Duration: </Text>
            {getDuration(selectedTrip.startTime, selectedTrip.endTime)}
          </Text>
          {selectedTrip.description ? (
            <Text style={styles.tripInfoDesc}>{selectedTrip.description}</Text>
          ) : null}
        </View>
      )}

      {/* ── Day Navigation ── */}
      {days.length > 0 && (
        <View style={[styles.dayNav, { borderBottomColor: '#e5e7eb' }]}>
          <FlatList
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={d => d.key}
            contentContainerStyle={styles.dayNavContent}
            renderItem={({ item: day }) => {
              const isActive = selectedDate &&
                day.date.getDate() === selectedDate.getDate() &&
                day.date.getMonth() === selectedDate.getMonth() &&
                day.date.getFullYear() === selectedDate.getFullYear();
              const hasItems = daysWithItems.has(day.key);
              return (
                <TouchableOpacity
                  style={[styles.dayBtn, isActive && styles.dayBtnActive]}
                  onPress={() => setSelectedDate(day.date)}
                  activeOpacity={0.8}>
                  <Text style={[styles.dayBtnName, isActive && styles.dayBtnNameActive]}>
                    {day.dayName}
                  </Text>
                  <Text style={[styles.dayBtnNum, isActive && styles.dayBtnNumActive]}>
                    {day.dayNum}
                  </Text>
                  {hasItems && (
                    <View style={[styles.dayBtnDot, isActive && styles.dayBtnDotActive]} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* ── Itinerary Body ── */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.itinerarySection}>
          <Text style={styles.itineraryTitle}>
            {`Itinerary – ${itineraryDayLabel}`}
          </Text>

          {itineraryItems.length > 0 ? (
            <Itinerary items={itineraryItems} onEditItem={handleEditItem} />
          ) : (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayIcon}>🗓️</Text>
              <Text style={styles.emptyDayTxt}>Nothing planned for this day yet</Text>
            </View>
          )}

          {/* Add to this day */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}>
            <Icon name="plus" size={17} color="#4AABDB" />
            <Text style={styles.addBtnTxt}>Add to this day</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Add Item Modal ── */}
      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelect={handleAddSelect}
        colors={colors}
      />

    </SafeAreaView>
  );
}
