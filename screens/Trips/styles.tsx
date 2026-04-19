import { StyleSheet } from 'react-native';

const BLUE       = '#4AABDB';
const BLUE_DARK  = '#2E8FB8';
const BLUE_LIGHT = '#D6EEF8';
const BLUE_BG    = '#EAF5FB';
const MUTED      = '#6b7280';
const BORDER     = '#e5e7eb';
const WHITE      = '#ffffff';
const TEXT       = '#1a1a2e';

export default StyleSheet.create({

  root: { flex: 1 },

  // ── Top bar ─────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.40,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Scroll content ───────────────────────────────────────────────────────
  scroll: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 100,
    gap: 8,
  },

  // ── Search bar ───────────────────────────────────────────────────────────
  searchWrap: { marginBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderWidth: 1.5,
    backgroundColor: BLUE_BG,
    borderColor: BLUE_LIGHT,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: TEXT,
    padding: 0,
  },

  // ── Section label ────────────────────────────────────────────────────────
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 2,
  },
  sectionLabelTxt: { fontSize: 13, fontWeight: '700', color: TEXT },
  sectionLabelCount: { fontSize: 11, color: MUTED },

  // ── Trip card (owned) ────────────────────────────────────────────────────
  tripCard: {
    borderRadius: 15,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    // default border is the brand blue
    borderColor: BLUE,
  },
  tripCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    paddingHorizontal: 14,
  },
  tripIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: BLUE_BG,
  },
  tripName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 1,
  },
  tripDest: {
    fontSize: 12,
    color: MUTED,
  },
  tripMeta: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  tripDate: { fontSize: 12, color: MUTED },
  tripDays: { fontSize: 12, fontWeight: '600', color: TEXT, marginTop: 1 },

  // ── Permission badge ─────────────────────────────────────────────────────
  permBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  permBadgeTxt: {
    fontSize: 9,
    fontWeight: '700',
  },

  // ── Action strip ─────────────────────────────────────────────────────────
  tripActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tripActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  tripActionTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionDivider: {
    width: 1,
    backgroundColor: BORDER,
  },

  // ── TripCare polygon logo (used in owned trip cards) ─────────────────────
  logoOuter: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty state ──────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 28,
    backgroundColor: BLUE,
  },
  emptyBtnTxt: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Add dashed button ────────────────────────────────────────────────────
  addDashed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 15,
    padding: 13,
    marginTop: 4,
    borderColor: BLUE,
    backgroundColor: BLUE_BG,
  },
  addDashedTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },

  // ── Bottom sheet overlay ─────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 36,
    gap: 9,
    backgroundColor: WHITE,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: BORDER,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
    paddingLeft: 2,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  sheetOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sheetOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 1,
  },
  sheetOptionSub: {
    fontSize: 12,
    color: MUTED,
  },
  sheetCancel: {
    marginTop: 2,
    borderRadius: 26,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: BLUE_BG,
  },
  sheetCancelTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
  },
  sheetConfirmBtn: {
    borderRadius: 28,
    paddingVertical: 13,
    alignItems: 'center',
  },
});
