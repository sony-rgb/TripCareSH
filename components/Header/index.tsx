import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, TouchableOpacity, StatusBar, useColorScheme} from 'react-native';
import Text from '../Text';
import PopupMenu, { MenuItem } from '../PopupMenu';
import styles from './styles';
import PropTypes from 'prop-types';

export default function Header({
  style = {},
  styleLeft = {},
  styleCenter = {},
  styleRight = {},
  styleRightSecond = {},
  title = 'Title',
  subTitle = '',
  onPressLeft = () => {},
  onPressRight = () => {},
  onPressRightSecond = () => {},
  renderLeft = () => null,
  renderRightSecond = () => null,
  renderRight = () => null,
  menuItems = [] as MenuItem[],
  barStyle = '' as 'light-content' | 'dark-content' | 'default' | '',
  titleNumberOfLines = 1,
}) {
  const forceDark = useSelector(state => state.application.force_dark);

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    let option: 'light-content' | 'dark-content' | 'default' = isDarkMode ? 'light-content' : 'dark-content';
    if (forceDark) {
      option = 'light-content';
    }
    if (forceDark === false) {
      option = 'dark-content';
    }
    if (barStyle && (barStyle === 'light-content' || barStyle === 'dark-content' || barStyle === 'default')) {
      option = barStyle as 'light-content' | 'dark-content' | 'default';
    }
    StatusBar.setBarStyle(option, true);
  }, [barStyle, forceDark, isDarkMode]);

  return (
    <View style={[styles.contain, style]}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={[styles.contentLeft, styleLeft]}
          onPress={onPressLeft}>
          {renderLeft()}
        </TouchableOpacity>
      </View>
      <View style={[styles.contentCenter, styleCenter]}>
        <Text 
          headline 
          semibold 
          {...(titleNumberOfLines > 0 ? { numberOfLines: titleNumberOfLines } : {})}
        >
          {title}
        </Text>
        {subTitle !== '' && (
          <Text caption2 light>
            {subTitle}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          style={[styles.contentRightSecond, styleRightSecond]}
          onPress={onPressRightSecond}>
          {renderRightSecond()}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contentRight, styleRight]}
          onPress={onPressRight}>
          {renderRight()}
        </TouchableOpacity>
        <PopupMenu menuItems={menuItems} />
      </View>
    </View>
  );
}

Header.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRightSecond: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,
  renderRightSecond: PropTypes.func,
  onPressRightSecond: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  menuItems: PropTypes.array,
  barStyle: PropTypes.string,
};
