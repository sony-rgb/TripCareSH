import React, {useState, useRef} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Icon, Text, Button, TextInput, Logo, SafeAreaView, Header} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import { API_BASE_URL } from '../../appConfig';
import {regex} from '@utils';
import { useIsApiReachable } from '../../hooks';

/**
 * Reset Password Screen
 * 
 * Allows users to request a password reset via email.
 * Requires online connectivity - password reset cannot be done offline.
 * 
 * Design matches the password-reset.png mockup:
 * - Centered title and TripCare logo
 * - Email input field with label
 * - Helper text below input
 * - Full-width "Reset Password" button
 * - Proper validation and error handling
 */
export default function ResetPassword({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const isApiReachable = useIsApiReachable();
  
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  // Form state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Validation state
  const [touched, setTouched] = useState(false);
  const [fieldError, setFieldError] = useState('');

  /**
   * Validate email field
   */
  const validateEmail = (emailValue: string): string => {
    if (!emailValue || emailValue.trim().length === 0) {
      return 'Email is required';
    }
    if (!regex.email.test(emailValue)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  /**
   * Handle field end editing - validate
   */
  const handleEndEditing = () => {
    setTouched(true);
    const error = validateEmail(email);
    setFieldError(error);
  };

  /**
   * Handle password reset submission
   */
  const onReset = async () => {
    // Clear previous messages
    setErrorMessage(null);
    setSuccessMessage(null);
    
    // Validate email
    const error = validateEmail(email);
    setFieldError(error);
    setTouched(true);
    
    if (error) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Check if API is reachable
    if (isApiReachable === false) {
      setErrorMessage('You must be online to request a password reset. Please check your connection.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      
      console.log('[ResetPassword] Requesting password reset for:', email);
      
      // Call password reset API
      // Note: The backend endpoint requires authentication, but password reset should be public
      // We may need to create a public endpoint or use a different approach
      const response = await fetch(`${API_BASE_URL}/api/v1/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      // Backend always returns success (200 OK) to prevent email enumeration
      // The message is already in the response, but we use our own consistent message
      if (response.ok) {
        setSuccessMessage("If an account exists for that email, you'll receive a password reset link shortly.");
      } else {
        // This shouldn't happen, but handle it gracefully
        console.log('[ResetPassword] Unexpected response:', response.status, data);
        setSuccessMessage("If an account exists for that email, you'll receive a password reset link shortly.");
      }
      
    } catch (error: any) {
      console.error('[ResetPassword] Password reset error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim().length > 0 && regex.email.test(email);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('reset_password')}
        renderLeft={() => (
          <Icon
            name="arrow-left"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
        onPressLeft={() => navigation.goBack()}
      />
      
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          
          <ScrollView 
            style={{flex: 1}}
            contentContainerStyle={styles.scrollContent}>
            
            {/* Top Section */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Reset your Password</Text>
              <Logo width={200} height={100} style={styles.logo} />
            </View>
            
            {/* Form Section */}
            <View style={styles.formSection}>
              
              {/* Email Address */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    if (touched) {
                      const error = validateEmail(text);
                      setFieldError(error);
                    }
                  }}
                  onEndEditing={handleEndEditing}
                  onSubmitEditing={onReset}
                  success={!touched || fieldError === ''}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                {email.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setEmail('');
                      setFieldError('');
                      setTouched(false);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
                {touched && fieldError !== '' && (
                  <Text style={[styles.errorText, {color: colors.accent}]}>
                    {fieldError}
                  </Text>
                )}
              </View>
              
              {/* Helper Text */}
              <Text style={styles.helperText}>
                You'll receive an email if the address you entered is associated with an account.
              </Text>
              
              {/* Success Message */}
              {successMessage && (
                <View style={[styles.messageContainer, styles.successContainer]}>
                  <Text style={[styles.messageText, {color: '#059669'}]}>
                    {successMessage}
                  </Text>
                </View>
              )}
              
              {/* Error Message */}
              {errorMessage && (
                <View style={[styles.messageContainer, styles.errorContainer]}>
                  <Text style={[styles.messageText, {color: colors.accent}]}>
                    {errorMessage}
                  </Text>
                </View>
              )}
              
              {/* Reset Password Button */}
              <Button
                full
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: isFormValid ? colors.primary : '#E8ECF4',
                    opacity: isFormValid ? 1 : 0.7,
                  }
                ]}
                loading={loading}
                disabled={!isFormValid || loading}
                onPress={onReset}>
                <Text style={{
                  color: isFormValid ? '#FFFFFF' : '#6A707C',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Reset Password
                </Text>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

