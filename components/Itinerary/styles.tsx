import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  itineraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  cardContainer: {
    flex: 1,
  },
  itineraryCard: {
    backgroundColor: BaseColor.whiteColor,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  itemTitle: {
    color: BaseColor.textPrimaryColor,
    marginBottom: 4,
    paddingRight: 30, // Make room for edit icon
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: BaseColor.grayColor,
    marginRight: 8,
  },
  badgeCompleted: {
    backgroundColor: '#2ecc71',
  },
  badgeText: {
    color: BaseColor.whiteColor,
    fontSize: 12,
  },
  itemTime: {
    color: BaseColor.textSecondaryColor,
    marginBottom: 2,
  },
  itemLocation: {
    color: BaseColor.textSecondaryColor,
    marginBottom: 8,
  },
  itemDescription: {
    color: BaseColor.textPrimaryColor,
    lineHeight: 20,
    marginBottom: 8,
  },
  viewMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
});
