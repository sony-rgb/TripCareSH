import React from 'react';
import {Animated, View, TouchableOpacity} from 'react-native';
import * as Utils from '@utils';
import Icon from '../Icon';
import Text from '../Text';
import Image from '../Image';
import {useSelector} from 'react-redux';
import styles from './styles';
// @ts-ignore
import tripTimeImage from '../../assets/images/trip-time.png';
import { NavigationProp } from '@react-navigation/native';
// Fallback types if modules are missing
// Remove these and use your actual types if available
type RootStackParamList = any;
type RootState = any;

interface AnimatedHeaderProps {
  imageSource: any;
  scrollY: any; // fallback to any to avoid namespace error
  heightImageBanner?: number;
  heightHeader?: number;
  navigation?: NavigationProp<RootStackParamList>;
  children?: React.ReactNode;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  imageSource,
  scrollY,
  heightImageBanner = Utils.scaleWithPixel(250),
  heightHeader = Utils.heightHeader(),
  navigation,
  children,
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const login = auth.login.success;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, Utils.scaleWithPixel(100), Utils.scaleWithPixel(100)],
    outputRange: [heightImageBanner, heightHeader, 0],
  });

  const profileOpacity = scrollY.interpolate({
    inputRange: [0, Utils.scaleWithPixel(100)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const squareTop = scrollY.interpolate({
    inputRange: [0, Utils.scaleWithPixel(200)],
    outputRange: [Utils.heightHeader() + 40, 0],
    extrapolate: 'clamp',
  });

  const roundedRectangleOpacity = scrollY.interpolate({
    inputRange: [0, Utils.scaleWithPixel(100)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleProfilePress = () => {
    try {
      if (navigation) {
        if (login) {
          navigation.navigate('Profile');
        } else {
          navigation.navigate('Walkthrough');
        }
      } else {
        console.log('Navigation object is undefined');
      }
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={imageSource}
        style={[
          styles.imageBackground,
          {
            height: headerHeight,
          },
        ]}
      />
      <View style={styles.overlay}>
        <Animated.View style={[styles.centerSquareContainer, { opacity: profileOpacity }]}>
          <Image
            source={tripTimeImage}
            style={styles.centerSquareImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.logoContainer, { opacity: profileOpacity }]}>
          <Image
            source={require('../../assets/images/logo-new.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        {children}
        <Animated.View style={[styles.profileButton, { opacity: profileOpacity }]}>
          <TouchableOpacity
            onPress={handleProfilePress}
            activeOpacity={0.7}
            style={styles.profileButtonInner}
          >
            <Icon name="user" size={24} color="#FFFFFF" solid />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.roundedRectangle,
          {
            transform: [{ translateY: squareTop }],
            opacity: roundedRectangleOpacity,
          },
        ]}
      >
        <View style={styles.roundedRectangleBackground} />
        <View style={styles.leftPanel}>
          <Text style={styles.locationText}>San Jose, CA</Text>
          <Text style={styles.tripText}>trip starts in</Text>
        </View>
        <View style={styles.rightPanel}>
          <View style={styles.rightPanelBackground} />
          <Text style={styles.numberText}>14</Text>
          <Text style={styles.unitText}>Days</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default AnimatedHeader; 