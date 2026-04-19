import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 12,
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  contain: {
    flex: 1,
    padding: 20,
  },
  item: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  imageBrand: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
});
