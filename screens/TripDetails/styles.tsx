import { StyleSheet } from 'react-native';

const BLUE       = '#4AABDB';
const BLUE_DARK  = '#2E8FB8';
const BLUE_LIGHT = '#D6EEF8';
const BLUE_BG    = '#EAF5FB';
const TEXT       = '#1a1a2e';
const MUTED      = '#6b7280';
const BORDER     = '#e5e7eb';
const WHITE      = '#ffffff';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // ── Top bar ──────────────────────────────────────────────────────────────
  topBar: {
    backgroundColor: BLUE_BG,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_LIGHT,
    paddingHorizontal: 15,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3,
  },
  backTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: BLUE,
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },
  topBarBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  sharedBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  sharedBadgeTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: '#065f46',
  },
  ownerBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  ownerBadgeTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  menuBtn: {
    fontSize: 20,
    color: MUTED,
    letterSpacing: 1,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },

  // ── Date strip (collapsible) ─────────────────────────────────────────────
  dateStrip: {
    backgroundColor: BLUE_BG,
    paddingHorizontal: 17,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  dateStripLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT,
  },

  // ── Trip info box (expanded) ─────────────────────────────────────────────
  tripInfoBox: {
    backgroundColor: BLUE_BG,
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tripInfoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 4,
  },
  tripInfoRow: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 19,
  },
  tripInfoDesc: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 19,
    marginTop: 6,
  },

  // ── Day nav (horizontal pills) ───────────────────────────────────────────
  dayNav: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  dayNavContent: {
    gap: 7,
  },
  dayBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 11,
    backgroundColor: BLUE_BG,
    minWidth: 44,
  },
  dayBtnActive: {
    backgroundColor: BLUE,
  },
  dayBtnName: {
    fontSize: 10,
    fontWeight: '500',
    color: MUTED,
  },
  dayBtnNameActive: {
    color: WHITE,
  },
  dayBtnNum: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },
  dayBtnNumActive: {
    color: WHITE,
  },
  // dot indicator for days that have items
  dayBtnDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BLUE,
    marginTop: 2,
  },
  dayBtnDotActive: {
    backgroundColor: WHITE,
  },

  // ── Itinerary body ───────────────────────────────────────────────────────
  body: {
    flex: 1,
  },
  itinerarySection: {
    padding: 11,
    paddingTop: 15,
    paddingBottom: 15,
  },
  itineraryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 9,
  },

  // ── "Add to this day" dashed button ─────────────────────────────────────
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: BLUE,
    borderRadius: 13,
    padding: 11,
    backgroundColor: BLUE_BG,
    marginTop: 4,
  },
  addBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: BLUE,
  },

  // ── Empty day state ──────────────────────────────────────────────────────
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyDayIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyDayTxt: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 14,
  },

  // ── No trip selected ─────────────────────────────────────────────────────
  noTripContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noTripText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  noTripSubtext: {
    textAlign: 'center',
  },
});
