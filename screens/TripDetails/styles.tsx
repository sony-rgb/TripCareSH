import { BaseColor } from '@config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripHeaderCard: {
    backgroundColor: BaseColor.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: BaseColor.dividerColor,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripTitle: {
    flex: 1,
    marginRight: 8,
  },
  tripDetailsBody: {
    marginTop: 12,
  },
  dateRangeText: {
    color: BaseColor.textPrimaryColor,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BaseColor.dividerColor,
  },
  infoRowNoBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: BaseColor.textSecondaryColor,
    flex: 1,
  },
  infoValue: {
    color: BaseColor.textPrimaryColor,
    flex: 2,
    textAlign: 'right',
  },
  descriptionContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  descriptionRow: {
    marginTop: 15,
  },
  descriptionText: {
    color: BaseColor.textPrimaryColor,
    lineHeight: 22,
    marginBottom: 8,
  },
  viewMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  line: {
    width: '100%',
    height: 1,
    borderWidth: 0.5,
    borderColor: BaseColor.dividerColor,
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  calendarSection: {
    marginBottom: 16,
  },
  itinerarySection: {
    marginTop: 0,
  },
  noItemsText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  noItemsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  sectionTitle: {
    color: BaseColor.textPrimaryColor,
    marginBottom: 15,
  },
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
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
}); 