import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import Icon from '../Icon';
import styles from './styles';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {BaseColor, useTheme, DefaultFont} from '@config';
import {useTranslation} from 'react-i18next';

export default function DatePicker({
  style = {},
  selected = '',
  label = 'Label',
  minDate = '1950-01-01',
  maxDate = '2050-12-31',
  current = undefined,
  onCancel = () => {},
  onChange = (date: string) => {},
}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [selectedState, setSelected] = useState(selected);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [renderCalendar, setRenderCalendar] = useState(true);
  
  // Determine the initial calendar month to display
  const initialMonth = current || selected || minDate;

  useEffect(() => {
    setRenderCalendar(false);
    setTimeout(() => {
      setRenderCalendar(true);
    }, 250);
  }, [colors.card]);

  useEffect(() => {
    let marked = {};
    marked[selected] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDates(marked);
  }, [colors.primary, selected]);

  const setDaySelected = selectedDay => {
    let marked = {};
    marked[selectedDay] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDates(marked);
    setSelected(selectedDay);
  };

  return (
    <View
      style={[styles.contentPickDate, {backgroundColor: colors.card}, style]}>
      <Modal
        isVisible={modalVisible}
        backdropColor="rgba(0, 0, 0, 0.5)"
        backdropOpacity={1}
        animationIn="fadeIn"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={[styles.contentCalendar, {backgroundColor: colors.card}]}>
          {renderCalendar && (
            <Calendar
              style={{
                borderRadius: 8,
                backgroundColor: colors.card,
              }}
              renderArrow={direction => {
                return (
                  <Icon
                    name={direction == 'left' ? 'angle-left' : 'angle-right'}
                    size={14}
                    color={colors.primary}
                    enableRTL={true}
                  />
                );
              }}
              markedDates={markedDates}
              current={initialMonth}
              minDate={minDate}
              maxDate={maxDate}
              onDayPress={day => setDaySelected(day.dateString)}
              monthFormat={'MMM dd, yyyy'}
              theme={{
                calendarBackground: colors.card,
                textSectionTitleColor: colors.text,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: BaseColor.grayColor,
                dotColor: colors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: colors.primary,
                monthTextColor: colors.text,
                textDayFontFamily: DefaultFont,
                textMonthFontFamily: DefaultFont,
                textDayHeaderFontFamily: DefaultFont,
                textMonthFontWeight: 'bold',
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
          )}
          <View style={styles.contentActionCalendar}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelected(selected);
                onCancel();
              }}>
              <Text body1>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                onChange(selectedState);
              }}>
              <Text body1 primaryColor>
                {t('done')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.itemPick}
        onPress={() => setModalVisible(true)}>
        <Text caption1 light style={{marginBottom: 5}}>
          {label}
        </Text>
        <Text numberOfLines={1}>
          {selectedState}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

DatePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selected: PropTypes.string,
  label: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  current: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};
