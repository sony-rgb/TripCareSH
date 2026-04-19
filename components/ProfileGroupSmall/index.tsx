import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import Text from '../Text';
import Icon from '../Icon';
import styles from './styles';
import PropTypes from 'prop-types';

export default function ProfileGroupSmall({
  style = {},
  users = [],
  counter = 10,
  onPress = () => {},
}) {
  return (
    <TouchableOpacity
      style={[styles.content, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={{flexDirection: 'row'}}>
        {users.map((item, index) => {
          return (
            <Image
              key={index}
              source={item.image}
              style={[styles.thumb, index != 0 ? {marginLeft: -15} : {}]}
            />
          );
        })}
      </View>
      <View style={styles.couter}>
        <Text body1 grayColor>
          {`+${counter}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

ProfileGroupSmall.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  counter: PropTypes.number,
  users: PropTypes.array,
  onPress: PropTypes.func,
};
