import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import Icon from '../Icon';
import styles from './styles';
import {BaseColor, useTheme} from '@config';

export default function QuantityPicker({
  style = {},
  label = 'Adults',
  detail = '>= 12 years',
  value = 1,
  onChange = () => {},
}) {
  const [val, setVal] = useState(value);
  const {colors} = useTheme();

  const onChangeValue = type => {
    if (type == 'up') {
      setVal(val + 1);
    } else {
      setVal(val - 1 > 0 ? val - 1 : 0);
    }
    onChange();
  };

  return (
    <View style={[styles.contentPicker, {backgroundColor: colors.card}, style]}>
      <Text body1 numberOfLines={1} style={{marginBottom: 5}}>
        {label}
      </Text>
      <Text caption1 light style={{marginBottom: 5}}>
        {detail}
      </Text>
      <TouchableOpacity onPress={() => onChangeValue('up')}>
        <Icon name="plus-circle" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text title1>{val}</Text>
      <TouchableOpacity onPress={() => onChangeValue('down')}>
        <Icon name="minus-circle" size={24} color={BaseColor.grayColor} />
      </TouchableOpacity>
    </View>
  );
}

QuantityPicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  detail: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
};
