import { BaseColor } from '@config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  tripBox: {
    marginTop: 20,
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.5,
    elevation: 6,
    flexDirection: 'row'
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    marginBottom: 10,
  },
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultsInfo: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  tripListContainer: {
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: BaseColor.whiteColor,
    borderRadius: 12,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    margin: 0,
    marginTop: 60,
    marginRight: 20,
  },
  menuCard: {
    borderRadius: 8,
    padding: 8,
    minWidth: 150,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});