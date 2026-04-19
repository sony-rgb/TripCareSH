import React, { useState } from 'react';
import { View, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, Icon } from '@components';
import { useTheme } from '@config';
import styles from './styles';

// ── Type badge config ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { bg: string; iconColor: string; icon: string; label: string }> = {
  flight:   { bg: '#dbeafe', iconColor: '#3b82f6', icon: 'plane',   label: 'Flight'     },
  hotel:    { bg: '#fef3c7', iconColor: '#d97706', icon: 'bed',     label: 'Lodging'    },
  car:      { bg: '#d1fae5', iconColor: '#10b981', icon: 'car-alt', label: 'Car Rental' },
  activity: { bg: '#ede9fe', iconColor: '#7c3aed', icon: 'star',    label: 'Activity'   },
  cruise:   { bg: '#fce7f3', iconColor: '#9d174d', icon: 'ship',    label: 'Cruise'     },
};

function getTypeConfig(type?: string) {
  return TYPE_CONFIG[type ?? ''] ?? { bg: '#EAF5FB', iconColor: '#4AABDB', icon: 'calendar-alt', label: 'Event' };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(t?: string) {
  if (!t || !t.includes(':')) return t || '';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return t;
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(d?: any) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Single event card ─────────────────────────────────────────────────────────
function EventCard({ item, onEdit }: { item: any; onEdit: (item: any) => void }) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const cfg = getTypeConfig(item.type);

  const timeLine = [
    item.startTime ? formatTime(item.startTime) : '',
    item.endTime   ? formatTime(item.endTime)   : '',
  ].filter(Boolean).join(' – ');

  const dateLine = [
    item.startDate ? formatDate(item.startDate) : '',
    item.endDate && item.endDate !== item.startDate ? formatDate(item.endDate) : '',
  ].filter(Boolean).join(' → ');

  const subLine = [dateLine, timeLine].filter(Boolean).join(' · ');

  const openMap = () => {
    if (!item.location) return;
    const q = encodeURIComponent(item.location);
    Linking.openURL(`https://maps.google.com/?q=${q}`).catch(() =>
      Alert.alert('Maps', 'Could not open maps app.')
    );
  };

  return (
    <View style={[styles.eventCard, expanded && styles.eventCardExpanded]}>
      {/* ── Collapsed row (always visible) ── */}
      <TouchableOpacity
        style={styles.eventCollapsed}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}>
        {/* Type badge icon */}
        <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
          <Icon name={cfg.icon} size={17} color={cfg.iconColor} />
        </View>
        {/* Summary */}
        <View style={styles.eventSummary}>
          <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          {subLine ? (
            <Text style={styles.eventSub} numberOfLines={1}>{subLine}</Text>
          ) : null}
        </View>
        {/* Chevron */}
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#9ca3af"
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* ── Expanded body ── */}
      {expanded && (
        <View style={styles.eventBody}>
          <View style={styles.eventDivider} />

          {/* Type label */}
          <View style={[styles.typeLabelBadge, { backgroundColor: cfg.bg }]}>
            <Icon name={cfg.icon} size={13} color={cfg.iconColor} />
            <Text style={[styles.typeLabelTxt, { color: cfg.iconColor }]}>{cfg.label}</Text>
          </View>

          {/* Detail rows */}
          {dateLine ? <DetailRow label="Date" value={dateLine} /> : null}
          {timeLine ? <DetailRow label="Time" value={timeLine} /> : null}
          {item.location ? <DetailRow label="Location" value={item.location} /> : null}
          {item.description ? (
            <View style={styles.descRow}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{item.description}</Text>
            </View>
          ) : null}

          {/* Action buttons */}
          <View style={styles.eventActions}>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: '#4AABDB' }]}
              onPress={() => onEdit(item)}
              activeOpacity={0.85}>
              <Icon name="edit" size={13} color="white" />
              <Text style={styles.editBtnTxt}>Edit</Text>
            </TouchableOpacity>
            {item.location ? (
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={openMap}
                activeOpacity={0.85}>
                <Icon name="map-marker-alt" size={13} color="#4AABDB" />
                <Text style={styles.mapBtnTxt}>Map</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailCol}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

// ── Itinerary list ────────────────────────────────────────────────────────────
interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  startDate?: any;
  endDate?: any;
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

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="calendar-alt" size={40} color="#d1d5db" />
        <Text style={styles.emptyText}>No items yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map(item => (
        <EventCard
          key={item.id}
          item={item}
          onEdit={(i) => onEditItem && onEditItem(i)}
        />
      ))}
    </View>
  );
}
