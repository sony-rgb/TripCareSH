import { BaseColor } from '@config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  calendarSection: {
  },
  calendarList: {
    paddingHorizontal: 5,
  },
  calendarDayItem: {
    width: 60,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderStyle: 'solid',
  },
  monthText: {
    marginBottom: 2,
    textAlign: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
});
