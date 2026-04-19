import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Text from '../Text';
import Icon from '../Icon';
import { BaseColor, useTheme } from '@config';
import PropTypes from 'prop-types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStyle: {
    margin: 0,
    padding: 0,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 50,
    marginRight: 15,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: BaseColor.dividerColor,
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PopupMenu({
  menuItems = [],
  style = {},
  iconColor = BaseColor.grayColor,
  iconSize = 20,
}) {
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);

  const handleMenuPress = () => {
    if (menuItems.length > 0) {
      setIsVisible(true);
    }
  };

  const handleMenuItemPress = (item: MenuItem) => {
    setIsVisible(false);
    if (!item.disabled && item.onPress) {
      item.onPress();
    }
  };

  const handleBackdropPress = () => {
    setIsVisible(false);
  };

  // Don't render anything if no menu items
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.menuButton, style]}
        onPress={handleMenuPress}
        activeOpacity={0.7}>
        <Icon
          name="ellipsis-h"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>

      <Modal
        isVisible={isVisible}
        onBackdropPress={handleBackdropPress}
        onSwipeComplete={() => setIsVisible(false)}
        swipeDirection={['down']}
        style={styles.modalStyle}
        backdropOpacity={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver={true}
        statusBarTranslucent={true}
        coverScreen={true}
        hasBackdrop={false}>
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={handleBackdropPress}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    item.disabled && { opacity: 0.5 }
                  ]}
                  onPress={() => handleMenuItemPress(item)}>
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      size={16}
                      color={item.disabled ? BaseColor.grayColor : colors.text}
                    />
                  )}
                  <Text
                    style={styles.menuItemText}
                    body2
                    grayColor={item.disabled}
                    primaryColor={!item.disabled}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
                {index < menuItems.length - 1 && (
                  <View style={styles.separator} />
                )}
              </React.Fragment>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

PopupMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      onPress: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
}; 