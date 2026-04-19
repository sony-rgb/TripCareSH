import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    minHeight: 45,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5', // Slightly darker background
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Bottom border
    margin: 0,
    padding: 0,
    paddingVertical: 8,
  },
  contentLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: 60,
  },
  contentCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  contentRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 20,
    height: '100%',
  },
  contentRightSecond: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
  right: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
