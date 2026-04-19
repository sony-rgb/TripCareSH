import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Icon, Button, Logo, Text, SafeAreaView} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function SignUpSuccess({navigation}: {navigation: any}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['top', 'right', 'left', 'bottom']}>
        <ScrollView 
          style={{flex: 1}}
          contentContainerStyle={styles.successScrollContent}>
          
          {/* Header Section */}
          <View style={styles.successHeaderSection}>
            <Logo width={200} height={100} style={styles.successLogo} />
          </View>
          
          {/* Success Content */}
          <View style={styles.contentSection}>
            
            {/* Title */}
            <Text style={styles.successTitle}>
              {t('registration_successful')}
            </Text>
            
            {/* Description */}
            <Text style={styles.description}>
              {t('sign_up_success_desc')}
            </Text>
            
            {/* Email Verification Info Box */}
            <View style={styles.infoBox}>
              <Icon
                name="envelope"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>
                  {t('check_your_email')}
                </Text>
                <Text style={styles.infoText}>
                  {t('email_verification_instructions')}
                </Text>
              </View>
            </View>
            
            {/* Sign In Button */}
            <Button
              full
              style={[
                styles.signInButton,
                {
                  backgroundColor: colors.primary,
                }
              ]}
              onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInButtonText}>
                {t('go_to_sign_in')}
              </Text>
            </Button>
            
            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                {t('didnt_receive_email')}{' '}
                <Text style={[styles.helpLink, {color: colors.primary}]}>
                  {t('contact_support')}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
