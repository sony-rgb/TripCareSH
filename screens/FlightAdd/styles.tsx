import { BaseColor } from '@config';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  textInput: {
    marginTop: 10,
  },
  lineInformation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  airlinesList: {
    width: '100%', 
    paddingHorizontal: 10,
    borderRadius: 1,
    shadowColor: BaseColor.border,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    marginTop: -3
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
  },
  flightInfoContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  flightOverviewSection: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  flightStatus: {
    marginTop: 5,
    marginBottom: 5,
  },
  tripInfoSection: {
    marginBottom: 20,
    paddingVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
  },
  line: {
    height: 1,
    backgroundColor: BaseColor.dividerColor,
    marginVertical: 10,
  },
  addToTripButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  resultsContainer: {
    marginTop: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  flightNumberInput: {
    flex: 1,
    marginRight: 10,
    marginTop: 0,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 50,
  },
  buttonContent: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
