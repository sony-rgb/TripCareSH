import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import Image from '../Image';
import {Images, useTheme} from '@config';

export default function Card({
  style = {},
  children,
  styleContent = {},
  image = Images.profile2,
  onPress = () => {},
}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={image} style={styles.imageBanner} />
      <View style={[styles.content, styleContent]}>{children}</View>
    </TouchableOpacity>
  );
}

Card.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onPress: PropTypes.func,
};
