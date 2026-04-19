import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useConnectivity } from '../../hooks';
import styles from './styles';

/**
 * RequiresOnline Screen
 * 
 * Shown when the user has no auth token and the API is unreachable.
 * This screen blocks access to the app and prompts the user to connect to the internet.
 * 
 * Features:
 * - Shows offline message
 * - Provides a "Retry" button to check connectivity again
 * - Automatically retries when connectivity is restored
 */
export default function RequiresOnline({ navigation }: any) {
  const { colors } = useTheme();
  const { isReachable, checking, checkNow } = useConnectivity();

  // When API becomes reachable, trigger a re-bootstrap
  React.useEffect(() => {
    if (isReachable === true) {
      // API is now reachable, navigate to sign in
      console.log('[RequiresOnline] API is now reachable, navigating to SignIn');
      navigation.replace('SignIn');
    }
  }, [isReachable, navigation]);

  const handleRetry = () => {
    console.log('[RequiresOnline] User initiated retry');
    checkNow();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
            <Icon
              name="wifi-off"
              size={64}
              color={colors.primary}
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            No Internet Connection
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.text }]}>
            You must be online to sign in to TripCare. Please check your internet connection and try again.
          </Text>

          {/* Status indicator */}
          {checking && (
            <View style={styles.checkingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.checkingText, { color: colors.text }]}>
                Checking connection...
              </Text>
            </View>
          )}

          {/* Retry Button */}
          <Button
            full
            onPress={handleRetry}
            loading={checking}
            style={styles.retryButton}
          >
            Retry Connection
          </Button>

          {/* Help Text */}
          <Text style={[styles.helpText, { color: colors.text }]}>
            Make sure you're connected to Wi-Fi or mobile data
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

