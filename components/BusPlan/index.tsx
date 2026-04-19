import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Text from '../Text';
import styles from './styles';
import {useTheme} from '@config';
import {useTranslation} from 'react-i18next';

export default function BusPlan({
  style = {},
  fromCode = 'SIN',
  toCode = 'SYD',
  from = 'Singapore',
  to = 'Sydney',
  onPressFrom = () => {},
  onPressTo = () => {},
}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  return (
    <View style={[styles.contentRow, style]}>
      <TouchableOpacity
        style={styles.colCenter}
        onPress={onPressFrom}
        activeOpacity={0.9}>
        <Text body1 light>
          {t('from')}
        </Text>
        <Text header semibold>
          {fromCode}
        </Text>
        <Text body1 numberOfLines={1}>
          {from}
        </Text>
      </TouchableOpacity>
      <View style={styles.centerView}>
        <Icon name="bus" color={colors.primary} size={24} solid />
      </View>
      <TouchableOpacity
        style={styles.colCenter}
        onPress={onPressTo}
        activeOpacity={0.9}>
        <Text body1 light>
          {t('to')}
        </Text>
        <Text header semibold>
          {toCode}
        </Text>
        <Text body1 numberOfLines={1}>
          {to}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

BusPlan.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  fromCode: PropTypes.string,
  toCode: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  onPressFrom: PropTypes.func,
  onPressTo: PropTypes.func,
};
