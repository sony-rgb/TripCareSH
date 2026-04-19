import React, {useEffect, useState} from 'react';
import {View, StatusBar, Image} from 'react-native';
import * as Font from 'expo-font';
import {SafeAreaView} from '@components';
import {useAuthBootstrap, useGlobalConnectivity, useSyncOnReconnect} from '../../hooks';
import {registerBackgroundSync} from '../../tasks/backgroundSync';
import {initializeDatabase} from '../../database/init';
import styles from './styles';

/**
 * Loading Screen (Enhanced with Offline-First Bootstrap)
 * 
 * This screen now serves as the bootstrap/splash screen.
 * It performs the following:
 * 1. Loads fonts
 * 2. Initializes connectivity monitoring
 * 3. Runs auth bootstrap to determine navigation path
 * 4. Routes user to appropriate screen based on auth + connectivity status
 */
export default function Loading({navigation}) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Initialize global connectivity monitoring
  useGlobalConnectivity();
  
  // Trigger sync when connectivity transitions from offline → online
  useSyncOnReconnect();
  
  // Run auth bootstrap
  const { bootstrapStatus, isBootstrapping } = useAuthBootstrap();

  // Initialize database and load fonts on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize database tables first
        await initializeDatabase();
        
        // Then load fonts
        await Font.loadAsync({
          'Merriweather-Black': require('../../assets/fonts/Merriweather-Black.ttf'),
          'Merriweather-BlackItalic': require('../../assets/fonts/Merriweather-BlackItalic.ttf'),
          'Merriweather-Bold': require('../../assets/fonts/Merriweather-Bold.ttf'),
          'Merriweather-BoldItalic': require('../../assets/fonts/Merriweather-BoldItalic.ttf'),
          'Merriweather-Italic': require('../../assets/fonts/Merriweather-Italic.ttf'),
          'Merriweather-Light': require('../../assets/fonts/Merriweather-Light.ttf'),
          'Merriweather-LightItalic': require('../../assets/fonts/Merriweather-LightItalic.ttf'),
          'Merriweather-Regular': require('../../assets/fonts/Merriweather-Regular.ttf'),
          Merriweather: require('../../assets/fonts/Merriweather-Regular.ttf'),
          'Raleway-Black': require('../../assets/fonts/Raleway-Black.ttf'),
          'Raleway-BlackItalic': require('../../assets/fonts/Raleway-BlackItalic.ttf'),
          'Raleway-Bold': require('../../assets/fonts/Raleway-Bold.ttf'),
          'Raleway-BoldItalic': require('../../assets/fonts/Raleway-BoldItalic.ttf'),
          'Raleway-ExtraBold': require('../../assets/fonts/Raleway-ExtraBold.ttf'),
          'Raleway-ExtraBoldItalic': require('../../assets/fonts/Raleway-ExtraBoldItalic.ttf'),
          'Raleway-ExtraLight': require('../../assets/fonts/Raleway-ExtraLight.ttf'),
          'Raleway-ExtraLightItalic': require('../../assets/fonts/Raleway-ExtraLightItalic.ttf'),
          'Raleway-Italic': require('../../assets/fonts/Raleway-Italic.ttf'),
          'Raleway-Light': require('../../assets/fonts/Raleway-Light.ttf'),
          'Raleway-LightItalic': require('../../assets/fonts/Raleway-LightItalic.ttf'),
          'Raleway-Medium': require('../../assets/fonts/Raleway-Medium.ttf'),
          'Raleway-MediumItalic': require('../../assets/fonts/Raleway-MediumItalic.ttf'),
          'Raleway-Regular': require('../../assets/fonts/Raleway-Regular.ttf'),
          Raleway: require('../../assets/fonts/Raleway-Regular.ttf'),
          'Raleway-SemiBold': require('../../assets/fonts/Raleway-SemiBold.ttf'),
          'Raleway-SemiBoldItalic': require('../../assets/fonts/Raleway-SemiBoldItalic.ttf'),
          'Raleway-Thin': require('../../assets/fonts/Raleway-Thin.ttf'),
          'Raleway-ThinItalic': require('../../assets/fonts/Raleway-ThinItalic.ttf'),
          'Roboto-Black': require('../../assets/fonts/Roboto-Black.ttf'),
          'Roboto-BlackItalic': require('../../assets/fonts/Roboto-BlackItalic.ttf'),
          'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
          'Roboto-BoldItalic': require('../../assets/fonts/Roboto-BoldItalic.ttf'),
          'Roboto-Italic': require('../../assets/fonts/Roboto-Italic.ttf'),
          'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
          'Roboto-LightItalic': require('../../assets/fonts/Roboto-LightItalic.ttf'),
          'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
          'Roboto-MediumItalic': require('../../assets/fonts/Roboto-MediumItalic.ttf'),
          'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
          Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Thin': require('../../assets/fonts/Roboto-Thin.ttf'),
          'Roboto-ThinItalic': require('../../assets/fonts/Roboto-ThinItalic.ttf'),
        });
        console.log('[Loading] Fonts loaded successfully');
        setFontsLoaded(true);
      } catch (error) {
        console.error('[Loading] Error during initialization:', error);
        setFontsLoaded(true); // Continue even if initialization fails
      }
    };

    initialize();
  }, []);

  // Navigate based on bootstrap status
  useEffect(() => {
    // Wait for both fonts and bootstrap to complete
    if (!fontsLoaded || isBootstrapping) {
      return;
    }

    console.log('[Loading] Bootstrap complete, status:', bootstrapStatus);

    // Register background sync for authenticated users
    if (bootstrapStatus === 'authenticatedOnline' || bootstrapStatus === 'authenticatedOffline') {
      registerBackgroundSync().catch((error) => {
        console.warn('[Loading] Failed to register background sync:', error);
      });
    }

    // Add minimum display time for splash screen (10 seconds)
    const minDisplayTime = 4300;
    const timer = setTimeout(() => {
      switch (bootstrapStatus) {
        case 'needsSignIn':
          console.log('[Loading] Navigating to SignIn');
          navigation.replace('SignIn');
          break;

        case 'needsOnlineToSignIn':
          console.log('[Loading] Navigating to RequiresOnline');
          navigation.replace('RequiresOnline');
          break;

        case 'authenticatedOnline':
        case 'authenticatedOffline':
          console.log('[Loading] Navigating to Main');
          navigation.replace('Main');
          break;

        default:
          console.log('[Loading] Unknown status, defaulting to SignIn');
          navigation.replace('SignIn');
      }
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [fontsLoaded, isBootstrapping, bootstrapStatus, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
      />
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/triploader-optimized.gif')}
          style={styles.gif}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
