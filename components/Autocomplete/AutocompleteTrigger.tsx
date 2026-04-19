import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BaseColor } from '@config';

type ViewStyle = any;
type TextStyle = any;

export interface AutocompleteTriggerProps {
  value?: string;
  onOpen: () => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholderTextColor?: string;
  testID?: string;
}

export const AutocompleteTrigger: React.FC<AutocompleteTriggerProps> = ({
  value,
  onOpen,
  placeholder = 'Select...',
  editable = false,
  style,
  textStyle,
  placeholderTextColor = '#6C757D',
  testID,
}) => {
  const displayText = value || '';
  const showPlaceholder = !displayText;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={editable ? onOpen : undefined}
    >
      <Text
        style={[
          styles.text,
          showPlaceholder && styles.placeholderText,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {showPlaceholder ? placeholder : displayText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 46,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
    fontFamily: 'Raleway',
  },
  placeholderText: {
    color: '#6C757D',
    fontWeight: '400',
  },
});
