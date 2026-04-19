import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles';
import Modal from 'react-native-modal';
import {useTheme} from '@config';
import {useTranslation} from 'react-i18next';

export default function FormOption({
  style = {},
  label = 'Seat Class',
  value = 'Economy',
  option = [
    {
      value: 'Economy',
      text: 'Economy Class',
    },
    {
      value: 'Business',
      text: 'Business Class',
    },
    {
      value: 'First',
      text: 'First Class',
    },
    {
      value: 'Normal',
      text: 'Normal Class',
    },
  ],
  onCancel = () => {},
  onChange = () => {},
}) {
  const {t} = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [optionState, setOption] = useState(
    option.map(item => {
      return {
        ...item,
        checked: item.value === value,
      };
    }),
  );
  const [valueState, setValue] = useState(value);
  const {colors} = useTheme();

  const openModal = () => {
    setModalVisible(true);
    setOption(
      optionState.map(item => {
        return {
          ...item,
          checked: item.value === valueState,
        };
      }),
    );
  };

  const onSelect = select => {
    setOption(
      optionState.map(item => {
        return {
          ...item,
          checked: item.value === select.value,
        };
      }),
    );
  };

  const onApply = () => {
    const selected = optionState.filter(item => item.checked);
    if (selected.length > 0) {
      setValue(selected[0].value);
      setModalVisible(false);
      onChange();
    }
  };

  return (
    <View>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setOption(option.map(item => {
            return {
              ...item,
              checked: item.value === value,
            };
          }));
          onCancel();
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, {backgroundColor: colors.card}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {optionState.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.contentActionModalBottom,
                {borderBottomColor: colors.border},
              ]}
              key={item.value}
              onPress={() => onSelect(item)}>
              <Text body2 semibold primaryColor={item.checked}>
                {item.text}
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
        style={[styles.contentForm, {backgroundColor: colors.card}, style]}
        onPress={() => openModal()}>
        <Text caption2 light style={{marginBottom: 5}}>
          {label}
        </Text>
        <Text body1 semibold>
          {valueState}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

FormOption.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  value: PropTypes.string,
  option: PropTypes.array,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};
