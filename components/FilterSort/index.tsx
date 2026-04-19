import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import Icon from '../Icon';
import Text from '../Text';
import Button from '../Button';
import PropTypes from 'prop-types';
import {BaseColor, useTheme} from '@config';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

export default function FilterSort({
  style = {},
  sortOption = [
    {
      value: 'low_price',
      icon: 'sort-amount-up',
      text: 'lowest_price',
    },
    {
      value: 'hight_price',
      icon: 'sort-amount-down',
      text: 'hightest_price',
    },
    {
      value: 'high_rate',
      icon: 'sort-amount-up',
      text: 'hightest_rating',
    },
    {
      value: 'popular',
      icon: 'sort-amount-down',
      text: 'popularity',
    },
  ],
  sortSelected = {
    value: 'high_rate',
    icon: 'sort-amount-up',
    text: 'hightest_rating',
  },
  modeView = '',
  labelCustom = '',
  onChangeSort = () => {},
  onChangeView = () => {},
  onFilter = () => {},
}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const backgroundColor = colors.background;
  const cardColor = colors.card;

  const [sortOptionState, setSortOption] = useState(
    sortOption.map(item => {
      return {
        ...item,
        checked: item.value === sortSelected.value,
      };
    }),
  );
  const [sortSelectedState, setSortSelected] = useState(sortSelected);
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectFilter = selected => {
    setSortOption(
      sortOptionState.map(item => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  const onOpenSort = () => {
    setModalVisible(true);

    setSortOption(
      sortOptionState.map(item => {
        return {
          ...item,
          checked: item.value === sortSelectedState.value,
        };
      }),
    );
  };

  const onApply = () => {
    const sorted = sortOptionState.filter(item => item.checked);
    if (sorted.length > 0) {
      setSortSelected(sorted[0]);
      setModalVisible(false);
      onChangeSort();
    }
  };

  const iconModeView = modeView => {
    switch (modeView) {
      case 'block':
        return 'square';
      case 'grid':
        return 'th-large';
      case 'list':
        return 'th-list';
      default:
        return 'th-list';
    }
  };

  const customAction =
    modeView !== '' ? (
      <TouchableOpacity onPress={onChangeView} style={styles.contentModeView}>
        <Icon
          name={iconModeView(modeView)}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
      </TouchableOpacity>
    ) : (
      <Text headline grayColor numberOfLines={1} style={styles.contentModeView}>
        {labelCustom}
      </Text>
    );

  return (
    <View style={[styles.contain, {backgroundColor}, style]}>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setSortOption(sortOption.map(item => {
            return {
              ...item,
              checked: item.value === sortSelected.value,
            };
          }));
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, {backgroundColor: cardColor}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {sortOptionState.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.contentActionModalBottom,
                {borderBottomColor: colors.border},
              ]}
              key={item.value}
              onPress={() => onSelectFilter(item)}>
              <Text body2 semibold primaryColor={item.checked}>
                {t(item.text)}
              </Text>
              {item.checked && (
                <Icon name="check" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          <Button
            full
            style={{marginTop: 10, marginBottom: 20}}
            styleText={{}}
            onPress={() => onApply()}>
            {t('apply')}
          </Button>
        </View>
      </Modal>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => onOpenSort()}>
        <Icon
          name={sortSelectedState.icon}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
        <Text headline grayColor style={{marginLeft: 5}}>
          {t(sortSelectedState.text)}
        </Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {customAction}
        <View style={styles.line} />
        <TouchableOpacity onPress={onFilter} style={styles.contentFilter}>
          <Icon name="filter" size={16} color={BaseColor.grayColor} solid />
          <Text headline grayColor style={{marginLeft: 5}}>
            {t('filter')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

FilterSort.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sortOption: PropTypes.array,
  sortSelected: PropTypes.object,
  modeView: PropTypes.string,
  labelCustom: PropTypes.string,
  onChangeSort: PropTypes.func,
  onChangeView: PropTypes.func,
  onFilter: PropTypes.func,
};
