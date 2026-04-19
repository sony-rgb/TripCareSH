import React from 'react';
import {TextInput as RNTextInput, View, I18nManager} from 'react-native';
import PropTypes from 'prop-types';
import {BaseStyle, BaseColor, useTheme} from '@config';

const Index = React.forwardRef<RNTextInput, {
  style?: any;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onEndEditing?: (e?: any) => void;
  placeholder?: string;
  value?: string;
  success?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search';
  multiline?: boolean;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  icon?: React.ReactNode;
  onSubmitEditing?: () => void;
  editable?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}>(({
  style = {},
  onChangeText = text => {},
  onFocus = () => {},
  onEndEditing = () => {},
  placeholder = 'Placeholder',
  value = '',
  success = true,
  secureTextEntry = false,
  keyboardType = 'default' as const,
  multiline = false,
  textAlignVertical = 'center' as const,
  icon = null,
  onSubmitEditing = () => {},
  editable = true,
  returnKeyType = 'done',
  autoCapitalize = 'sentences',
}, ref) => {
  const {colors} = useTheme();
  const cardColor = colors.card;
  return (
    <View style={[BaseStyle.textInput, {backgroundColor: cardColor}, style]}>
      <RNTextInput
        ref={ref}
        style={{
          fontFamily: 'Raleway',
          flex: 1,
          height: '100%',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          paddingTop: 5,
          paddingBottom: 5,
          color: editable ? colors.text : BaseColor.grayColor
        }}
        onChangeText={text => onChangeText(text)}
        onFocus={() => onFocus()}
        onEndEditing={onEndEditing}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={success ? BaseColor.grayColor : colors.accent}
        secureTextEntry={secureTextEntry}
        value={value}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        borderColor={success ? 'transparent' : colors.accent}
        borderBottomWidth={success ? 0 : 1}
      />
      {icon}
    </View>
  );
});

Index.displayName = 'TextInput';

export default Index;

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeText: PropTypes.func,
  onFocus: PropTypes.func,
  onEndEditing: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  success: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'email-address',
    'numeric',
    'phone-pad',
    'number-pad',
    'decimal-pad',
    'visible-password',
    'ascii-capable',
    'numbers-and-punctuation',
    'url',
    'name-phone-pad',
    'twitter',
    'web-search'
  ]),
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.oneOf(['auto', 'top', 'bottom', 'center']),
  icon: PropTypes.node,
  onSubmitEditing: PropTypes.func,
  editable: PropTypes.bool,
};
