import React from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import Image from '../Image';
import Text from '../Text';
import PropTypes from 'prop-types';
import {useTheme} from '@config';

export default function TourDay({
  style = {},
  onPress = () => {},
  day = '',
  title = '',
  image = '',
  description = '',
}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[styles.contain, {backgroundColor: colors.card}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Text headline primaryColor semibold style={{marginBottom: 10}}>
        {day}
      </Text>
      <Image source={image} style={{width: 215, height: 100}} />
      <Text
        title3
        semibold
        style={{
          marginTop: 8,
        }}
        numberOfLines={1}>
        {title}
      </Text>
      <Text
        body2
        style={{
          marginTop: 8,
        }}
        numberOfLines={5}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

TourDay.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  day: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};
