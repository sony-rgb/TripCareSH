import React from 'react';
import {Image, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

type ResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';

export default function Index({
  style = {},
  resizeMode = 'cover' as ResizeMode,
  ...props
}: {
  style?: any;
  resizeMode?: ResizeMode;
  [key: string]: any;
}) {
  return (
    <View style={[styles.contaner, style]}>
      <Image {...props} style={styles.content} resizeMode={resizeMode} />
    </View>
  );
}

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  resizeMode: PropTypes.string,
};
