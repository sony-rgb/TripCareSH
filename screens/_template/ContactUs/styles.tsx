import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 12,
    marginTop: 10,
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
