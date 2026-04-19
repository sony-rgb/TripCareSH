import { StyleSheet, Platform } from 'react-native';

// TripCare brand palette — mirrors the prototype
const BLUE       = '#4AABDB';
const BLUE_DARK  = '#2E8FB8';
const BLUE_LIGHT = '#D6EEF8';
const MUTED      = '#6b7280';
const BORDER     = '#e5e7eb';
const WHITE      = '#ffffff';

export default StyleSheet.create({

  // ── Scroll container ──────────────────────────────────────────────────
  scroll: {
    paddingBottom: 90,
  },

  // ── Header bar ───────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greetingLabel: {
    fontSize: 12,
    marginBottom: 1,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // gradient-like shadow
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Card padding wrapper ─────────────────────────────────────────────
  cardPad: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },

  // ── Next Trip card ───────────────────────────────────────────────────
  nextTripCard: {
    backgroundColor: '#1a3a55',
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    // deep blue gradient feel via shadow
    shadowColor: BLUE_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 6,
    // subtle gradient via backgroundGradient-like overlay (done in JSX)
    background: 'linear-gradient(135deg, #1a3a55, #2E8FB8)', // web only, harmless on native
  },
  ntCircle1: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  ntCircle2: {
    position: 'absolute',
    bottom: -30,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  ntLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  ntRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ntTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 5,
    lineHeight: 23,
  },
  ntDest: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  ntDates: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },
  ntDaysBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ntDaysNum: {
    fontSize: 22,
    fontWeight: '800',
    color: WHITE,
    lineHeight: 26,
  },
  ntDaysLbl: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  ntProgressTrack: {
    marginTop: 16,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    flexDirection: 'row',
  },
  ntProgressFill: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 2,
  },
  ntProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  ntProgressLeft: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  ntProgressRight: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  // Empty state (no trip)
  noTripTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: WHITE,
    marginBottom: 4,
  },
  noTripBody: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // ── Section headers ──────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Horizontal list ──────────────────────────────────────────────────
  hList: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 10,
  },

  // ── Blog cards ───────────────────────────────────────────────────────
  blogCard: {
    width: 148,
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  blogCardImg: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blogEmoji: {
    fontSize: 28,
  },
  blogCardBody: {
    padding: 9,
    paddingBottom: 11,
  },
  blogTitle: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  blogDate: {
    fontSize: 10,
    color: MUTED,
    marginTop: 4,
  },

  // ── Itinerary 2-col grid ─────────────────────────────────────────────
  itnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  itnCard: {
    width: '47.5%',
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itnCardImg: {
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itnEmoji: {
    fontSize: 28,
  },
  itnCardBody: {
    padding: 9,
    paddingBottom: 11,
  },
  itnTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  itnDuration: {
    fontSize: 10,
    color: MUTED,
    marginTop: 2,
  },
});
