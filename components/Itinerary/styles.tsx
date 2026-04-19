import { StyleSheet } from 'react-native';

const BLUE      = '#4AABDB';
const BLUE_BG   = '#EAF5FB';
const TEXT      = '#1a1a2e';
const MUTED     = '#6b7280';
const BORDER    = '#e5e7eb';
const WHITE     = '#ffffff';

export default StyleSheet.create({

  container: {},

  // ── Event card ──────────────────────────────────────────────────────────
  eventCard: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  eventCardExpanded: {
    borderColor: BLUE,
    shadowColor: BLUE,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },

  // ── Collapsed row ───────────────────────────────────────────────────────
  eventCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 13,
    paddingHorizontal: 14,
  },
  typeBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventSummary: {
    flex: 1,
    minWidth: 0,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
  },
  eventSub: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },
  chevron: {
    flexShrink: 0,
  },

  // ── Expanded body ────────────────────────────────────────────────────────
  eventBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  eventDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 12,
    marginHorizontal: -14,
  },
  typeLabelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeLabelTxt: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Detail rows ──────────────────────────────────────────────────────────
  detailRow: {
    marginBottom: 8,
  },
  descRow: {
    marginBottom: 8,
  },
  detailCol: {},
  detailLabel: {
    fontSize: 10,
    color: MUTED,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT,
    lineHeight: 17,
  },

  // ── Action buttons ────────────────────────────────────────────────────────
  eventActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 9,
    borderRadius: 10,
  },
  editBtnTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: WHITE,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: BLUE_BG,
    borderWidth: 1.5,
    borderColor: '#D6EEF8',
  },
  mapBtnTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: BLUE,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: MUTED,
    fontStyle: 'italic',
  },
});
