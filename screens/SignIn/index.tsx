import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AuthActions} from '../../actions';
import {setAuthToken} from '../../actions/auth';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

import {BaseStyle, useTheme} from '@config';
import {Icon, Text, Button, TextInput, Logo} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import AuthService from '../../services/AuthService';

export default function SignIn({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState({email: true, password: true});
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle sign in with the new AuthService + Redux token storage
   */
  const onLogin = async () => {
    if (email === '' || password === '') {
      setSuccess({
        ...success,
        email: email !== '',
        password: password !== '',
      });
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      
      // Use the new AuthService to sign in
      const user = await AuthService.signIn(email, password);
      
      // Store the auth user immediately, then try to refresh profile (if available)
      const { container } = require('../../services');
      try {
        await container.getUserService().storeUserFromAuth(user);
      } catch (error) {
        console.error('Error storing auth user locally after sign-in:', error);
      }
      try {
        await container.getUserService().fetchAndStoreUserProfile();
      } catch (error) {
        console.error('Error fetching user profile after sign-in:', error);
        // Continue even if profile fetch fails
      }
      
      // Get the token from AuthService (it stores it internally)
      const token = await AuthService.getAccessToken();
      
      // Access the internal tokens to get expiry
      // @ts-ignore - accessing private property for integration
      const tokens = (AuthService as any).tokens;
      
      if (token && tokens?.expiresAt) {
        // Convert ISO string to Unix timestamp in milliseconds
        const expiresAtMs = new Date(tokens.expiresAt).getTime();
        
        console.log('[SignIn] Storing token in Redux:', {
          token: token.substring(0, 20) + '...',
          expiresAt: new Date(expiresAtMs).toISOString(),
        });
        
        // Store token in Redux (for bootstrap logic)
        dispatch(setAuthToken(token, expiresAtMs));
      }
      
      // Update Redux state (for backward compatibility)
      dispatch(
        AuthActions.authentication(true, response => {
          setLoading(false);
          console.log('[SignIn] Signed in successfully as:', user.name);
          // SyncManager will handle initial sync automatically when authentication action triggers
          // Navigate to main app
          navigation.replace('Main');
        }),
      );
    } catch (error: any) {
      setLoading(false);
      console.error('[SignIn] Sign in error:', error);
      console.error('[SignIn] Error details:', {
        message: error.message,
        status: error.status,
        response: error.response,
        name: error.name,
      });
      
      // Handle different types of errors
      let errorMsg = 'An unexpected error occurred. Please try again.';
      
      // Check if it's a network error (fetch failed, no internet, etc.)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMsg = 'Network error. Please check your internet connection.';
      }
      // Check if it's an HTTP error with status code
      else if (error.status) {
        const status = error.status;
        const responseData = error.response;
        
        console.log('[SignIn] HTTP Error - Status:', status, 'Response:', responseData);
        
        // SECURITY: For authentication endpoints, map all errors to generic invalid credentials
        // This prevents information leakage about server status, user existence, etc.
        if (status === 401 || status === 403 || status === 500 || status >= 500) {
          // All authentication failures should show the same message
          errorMsg = 'Invalid email or password. Please try again.';
          
          // Log the real error for debugging (but don't show to user)
          console.warn('[SignIn] Authentication failed with status:', status);
          console.warn('[SignIn] Server response:', responseData);
        } else if (status === 404) {
          errorMsg = 'Service unavailable. Please try again later.';
        } else if (responseData?.message) {
          // Use the message from the API response if available (for other error types)
          errorMsg = responseData.message;
        } else if (responseData?.error?.message) {
          // Check nested error message structure
          errorMsg = responseData.error.message;
        }
      }
      // Check error message content for specific keywords
      else if (error.message) {
        const message = error.message.toLowerCase();
        
        // Map error message keywords to user-friendly messages
        if (message.includes('invalid credentials') || 
            message.includes('invalid email or password') ||
            message.includes('unauthorized') ||
            message.includes('bad credentials')) {
          errorMsg = 'Invalid email or password. Please try again.';
        } else if (message.includes('email verification') || 
                   message.includes('email not verified') ||
                   message.includes('verify your email')) {
          errorMsg = 'Please verify your email before signing in.';
        } else if (message.includes('network') || 
                   message.includes('connection') ||
                   message.includes('timeout')) {
          errorMsg = 'Network error. Please check your internet connection.';
        } else if (message.includes('missing parameters') ||
                   message.includes('required field')) {
          errorMsg = 'Please fill in all fields.';
        } else if (message.length < 100) {
          // Use the error message directly if it's reasonably short
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      setSuccess({
        ...success,
        email: false,
        password: false,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <View style={styles.contain}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>Glad to see you again!</Text>
            
            {/* Blue Arrow Logo */}
            <Logo 
              width={200}
              height={100}
              style={styles.logo}
            />
          </View>
          
          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input with Clear Icon */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={text => setEmail(text)}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    email: true,
                  });
                  setErrorMessage(null);
                }}
                success={success.email}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder=""
              />
              {email.length > 0 && (
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={() => setEmail('')}>
                  <Icon name="times" size={16} color="#6A707C" />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Password Input with Show/Hide Icon */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={text => setPassword(text)}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    password: true,
                  });
                  setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
                success={success.password}
                value={password}
                placeholder=""
              />
              <TouchableOpacity 
                style={styles.inputIcon}
                onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-slash" : "eye"} size={16} color="#6A707C" />
              </TouchableOpacity>
            </View>
            
            {/* Error message */}
            {errorMessage && (
              <Text style={{...styles.errorText, color: colors.accent}}>
                {errorMessage}
              </Text>
            )}
            
            {/* Sign in button */}
            <Button
              style={styles.signInButton}
              full
              loading={loading}
              onPress={() => {
                onLogin();
              }}>
              Sign In
            </Button>
            
            {/* Forgot password link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}
              style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Spacer */}
          <View style={styles.spacer} />
          
          {/* Sign up link at the bottom */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
