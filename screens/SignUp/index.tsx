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
import {Icon, Button, TextInput, Logo, Text, SafeAreaView, AutocompleteModal, LegalDocumentModal} from '@components';
import type {AutocompleteOption, FetchOptionsFn} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import { API_BASE_URL } from '../../appConfig';
import {regex} from '@utils';
import { useIsApiReachable } from '../../hooks';
import { PRIVACY_POLICY, USER_AGREEMENT } from '../../data/legalDocuments';

/**
 * Sign Up Screen
 * 
 * Matches the registration mockup with the following features:
 * - Title and TripCare logo centered at top
 * - Separate first name and last name fields
 * - Email and password fields with validation
 * - Home city autocomplete
 * - Terms & policies checkbox with clickable links
 * - "Create an Account" button (disabled until valid)
 * - Online-only operation (no offline storage of registration data)
 * 
 * All validation is client-side before submitting to the backend.
 * Server errors are displayed as user-friendly messages.
 */
export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const isApiReachable = useIsApiReachable();
  
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [homeCityId, setHomeCityId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  
  // Refs for field navigation
  const lastNameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Legal document modal states
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [userAgreementModalVisible, setUserAgreementModalVisible] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [userAgreementAccepted, setUserAgreementAccepted] = useState(false);
  
  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    homeCity: '',
    terms: '',
  });
  
  // Field touched states (for showing validation only after user interacts)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    homeCity: false,
    terms: false,
  });

  /**
   * Validate individual field
   */
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length < 2) {
          return `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        }
        if (!regex.name.test(value)) {
          return 'Only letters, spaces, hyphens, and apostrophes allowed';
        }
        return '';
      
      case 'email':
        if (!value || value.trim().length === 0) {
          return 'Email is required';
        }
        if (!regex.email.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      
      case 'password':
        if (!value || value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one digit';
        }
        if (!regex.password.test(value)) {
          return 'Password contains invalid characters';
        }
        return '';
      
      case 'homeCity':
        if (!value || value.trim().length === 0) {
          return 'Home city is required';
        }
        if (value.trim().length < 2) {
          return 'Home city must be at least 2 characters';
        }
        return '';
      
      case 'terms':
        if (!privacyAccepted || !userAgreementAccepted) {
          return 'You must read and accept both policies';
        }
        return '';
      
      default:
        return '';
    }
  };

  /**
   * Handle field blur - validate and mark as touched
   */
  const handleBlur = (field: string) => {
    setTouched({...touched, [field]: true});
    
    // Get the current value for the field
    let value: any;
    switch (field) {
      case 'firstName': value = firstName; break;
      case 'lastName': value = lastName; break;
      case 'email': value = email; break;
      case 'password': value = password; break;
      case 'homeCity': value = homeCity; break;
      case 'terms': value = privacyAccepted && userAgreementAccepted; break;
      default: value = '';
    }
    
    const error = validateField(field, value);
    console.log(`[SignUp] ${field} validation:`, error || 'Valid');
    setFieldErrors({...fieldErrors, [field]: error});
  };

  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    const checks = {
      firstName: firstName.trim().length >= 2,
      firstNameRegex: regex.name.test(firstName),
      lastName: lastName.trim().length >= 2,
      lastNameRegex: regex.name.test(lastName),
      email: regex.email.test(email),
      password: regex.password.test(password),
      homeCity: homeCity.trim().length >= 2,
      terms: privacyAccepted && userAgreementAccepted,
    };
    
    // Debug logging to see what's failing
    const isValid = Object.values(checks).every(Boolean);
    if (!isValid) {
      console.log('[SignUp] Form validation failed:', checks);
      console.log('[SignUp] Password length:', password.length, 'Password:', password);
    }
    
    return isValid;
  };

  /**
   * Search for cities using the guest location API
   */
  const searchCities: FetchOptionsFn = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/guest-location/search?q=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return (data.cities || []).map((city: any) => ({
        id: city.placeId,
        label: city.name,
        value: city.placeId,
      }));
    } catch (error) {
      console.error('[SignUp] Error fetching cities:', error);
      throw new Error('Unable to fetch cities. Please check your connection.');
    }
  };
  
  /**
   * Handle city selection from autocomplete
   */
  const handleCitySelect = (option: AutocompleteOption) => {
    setHomeCity(option.label);
    setHomeCityId(option.id);
    setTouched({...touched, homeCity: true});
    const error = validateField('homeCity', option.label);
    setFieldErrors({...fieldErrors, homeCity: error});
    setCityModalVisible(false);
  };

  /**
   * Handle sign up submission
   */
  const onSignUp = async () => {
    console.log('[SignUp] Sign up initiated');
    
    // Check if API is reachable
    if (isApiReachable === false) {
      setErrorMessage('You must be online to create an account. Please check your connection.');
      return;
    }

    // Validate all fields
    const errors = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      email: validateField('email', email),
      password: validateField('password', password),
      homeCity: validateField('homeCity', homeCity),
      terms: validateField('terms', privacyAccepted && userAgreementAccepted),
    };
    
    setFieldErrors(errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      homeCity: true,
      terms: true,
    });
    
    // Check if any errors exist
    if (Object.values(errors).some(error => error !== '')) {
      setErrorMessage('Please fix the errors above');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      
      console.log('[SignUp] Registering user:', { firstName, lastName, email, homeCity });
      
      // Call registration API (UserController endpoint)
      const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          homeCity: homeCityId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('[SignUp] Error response:', errorData);
        
        // Handle specific error codes
        if (response.status === 409 || errorData.code === 'EMAIL_EXISTS') {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid registration data. Please check your inputs.');
        }
        
        throw new Error(errorData.message || 'Registration failed. Please try again.');
      }

      const userData = await response.json();
      console.log('[SignUp] Registration successful:', userData);
      
      // Navigate to success screen
      navigation.navigate('SignUpSuccess');
      
    } catch (error: any) {
      console.error('[SignUp] Registration error:', error);
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Privacy Policy acceptance
   */
  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    // Auto-set terms if both documents accepted
    if (userAgreementAccepted) {
      setAgreesToTerms(true);
      setTouched({...touched, terms: true});
      setFieldErrors({...fieldErrors, terms: ''});
    }
  };

  /**
   * Handle User Agreement acceptance
   */
  const handleUserAgreementAccept = () => {
    setUserAgreementAccepted(true);
    // Auto-set terms if both documents accepted
    if (privacyAccepted) {
      setAgreesToTerms(true);
      setTouched({...touched, terms: true});
      setFieldErrors({...fieldErrors, terms: ''});
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['top', 'right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          
          <ScrollView 
            style={{flex: 1}}
            contentContainerStyle={styles.scrollContent}>
            
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Sign Up</Text>
              <Logo width={200} height={100} style={styles.logo} />
            </View>
            
            {/* Form Section */}
            <View style={styles.formSection}>
              
              {/* First Name */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  value={firstName}
                  onChangeText={setFirstName}
                  onEndEditing={() => handleBlur('firstName')}
                  onSubmitEditing={() => {
                    handleBlur('firstName');
                    lastNameRef.current?.focus();
                  }}
                  success={!touched.firstName || fieldErrors.firstName === ''}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {firstName.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setFirstName('');
                      setFieldErrors({...fieldErrors, firstName: ''});
                      setTouched({...touched, firstName: false});
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
                {touched.firstName && fieldErrors.firstName !== '' && (
                  <Text style={[styles.errorText, {color: colors.accent}]}>
                    {fieldErrors.firstName}
                  </Text>
                )}
              </View>
              
              {/* Last Name */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  ref={lastNameRef}
                  style={styles.textInput}
                  placeholder=""
                  value={lastName}
                  onChangeText={setLastName}
                  onEndEditing={() => handleBlur('lastName')}
                  onSubmitEditing={() => {
                    handleBlur('lastName');
                    emailRef.current?.focus();
                  }}
                  success={!touched.lastName || fieldErrors.lastName === ''}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {lastName.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setLastName('');
                      setFieldErrors({...fieldErrors, lastName: ''});
                      setTouched({...touched, lastName: false});
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
                {touched.lastName && fieldErrors.lastName !== '' && (
                  <Text style={[styles.errorText, {color: colors.accent}]}>
                    {fieldErrors.lastName}
                  </Text>
                )}
              </View>
              
              {/* Email Address */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  ref={emailRef}
                  style={styles.textInput}
                  placeholder=""
                  value={email}
                  onChangeText={setEmail}
                  onEndEditing={() => handleBlur('email')}
                  onSubmitEditing={() => {
                    handleBlur('email');
                    passwordRef.current?.focus();
                  }}
                  success={!touched.email || fieldErrors.email === ''}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                {email.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setEmail('');
                      setFieldErrors({...fieldErrors, email: ''});
                      setTouched({...touched, email: false});
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
                {touched.email && fieldErrors.email !== '' && (
                  <Text style={[styles.errorText, {color: colors.accent}]}>
                    {fieldErrors.email}
                  </Text>
                )}
              </View>
              
              {/* Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  ref={passwordRef}
                  style={styles.textInput}
                  placeholder=""
                  value={password}
                  onChangeText={setPassword}
                  onEndEditing={() => handleBlur('password')}
                  onSubmitEditing={() => {
                    handleBlur('password');
                    // Dismiss keyboard after password field
                  }}
                  success={!touched.password || fieldErrors.password === ''}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? 'eye-slash' : 'eye'} size={16} color="#6A707C" />
                </TouchableOpacity>
                {touched.password && fieldErrors.password !== '' && (
                  <Text style={[styles.errorText, {color: colors.accent}]}>
                    {fieldErrors.password}
                  </Text>
                )}
                {!touched.password && password.length === 0 && (
                  <Text style={[styles.errorText, {color: '#6A707C', fontSize: 12, fontWeight: '400'}]}>
                    Must be 8+ characters with uppercase, lowercase, and digit
                  </Text>
                )}
              </View>
              
              {/* Home City */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Home City</Text>
                <TouchableOpacity onPress={() => setCityModalVisible(true)} activeOpacity={0.7}>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    value={homeCity}
                    success={!touched.homeCity || fieldErrors.homeCity === ''}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {homeCity.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={() => {
                      setHomeCity('');
                      setHomeCityId('');
                      setFieldErrors({...fieldErrors, homeCity: ''});
                      setTouched({...touched, homeCity: false});
                    }}>
                    <Icon name="times" size={16} color="#6A707C" />
                  </TouchableOpacity>
                )}
                {touched.homeCity && fieldErrors.homeCity !== '' && (
                  <Text style={[styles.errorText, {color: colors.accent}]}>
                    {fieldErrors.homeCity}
                  </Text>
                )}
              </View>
              
              {/* Terms & Policies Section */}
              <View style={styles.termsSection}>
                <Text style={styles.termsSectionTitle}>
                  Please read and accept our policies:
                </Text>
                
                {/* Privacy Policy Row */}
                <View style={styles.termsRow}>
                  <View style={[
                    styles.acceptedIndicator,
                    {
                      backgroundColor: privacyAccepted ? '#10B981' : '#E5E7EB',
                    }
                  ]}>
                    {privacyAccepted && (
                      <Icon name="check" size={10} color="white" />
                    )}
                  </View>
                  <TouchableOpacity 
                    onPress={() => setPrivacyModalVisible(true)}
                    style={styles.termsLinkButton}
                  >
                    <Text style={[
                      styles.termsLinkText, 
                      {color: colors.primary},
                      privacyAccepted && styles.termsAcceptedText
                    ]}>
                      TripCare Privacy Policy
                    </Text>
                    <Icon name="chevron-right" size={14} color={colors.primary} />
                  </TouchableOpacity>
                  {privacyAccepted && (
                    <Text style={styles.acceptedLabel}>Accepted</Text>
                  )}
                </View>
                
                {/* User Agreement Row */}
                <View style={styles.termsRow}>
                  <View style={[
                    styles.acceptedIndicator,
                    {
                      backgroundColor: userAgreementAccepted ? '#10B981' : '#E5E7EB',
                    }
                  ]}>
                    {userAgreementAccepted && (
                      <Icon name="check" size={10} color="white" />
                    )}
                  </View>
                  <TouchableOpacity 
                    onPress={() => setUserAgreementModalVisible(true)}
                    style={styles.termsLinkButton}
                  >
                    <Text style={[
                      styles.termsLinkText, 
                      {color: colors.primary},
                      userAgreementAccepted && styles.termsAcceptedText
                    ]}>
                      User Agreement
                    </Text>
                    <Icon name="chevron-right" size={14} color={colors.primary} />
                  </TouchableOpacity>
                  {userAgreementAccepted && (
                    <Text style={styles.acceptedLabel}>Accepted</Text>
                  )}
                </View>
              </View>
              
              {touched.terms && fieldErrors.terms !== '' && (
                <Text style={[styles.errorText, {color: colors.accent, marginTop: 5}]}>
                  {fieldErrors.terms}
                </Text>
              )}
              
              {/* Error Message */}
              {errorMessage && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorMessage, {color: colors.accent}]}>
                    {errorMessage}
                  </Text>
                </View>
              )}
              
              {/* Validation Help Message */}
              {!isFormValid() && (firstName.length > 0 || lastName.length > 0 || email.length > 0 || password.length > 0 || homeCity.length > 0 || privacyAccepted || userAgreementAccepted) && (
                <View style={{
                  backgroundColor: '#FFF9E6',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  borderLeftWidth: 3,
                  borderLeftColor: '#FFC107',
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: '#856404',
                    fontWeight: '500',
                  }}>
                    Please complete all required fields correctly to enable the button
                  </Text>
                </View>
              )}
              
              {/* Create Account Button */}
              <Button
                full
                style={[
                  styles.createButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: (!isFormValid() || loading) ? 0.6 : 1,
                  }
                ]}
                loading={loading}
                disabled={!isFormValid() || loading}
                onPress={onSignUp}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Create an Account
                </Text>
              </Button>
              
              {/* Sign In Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={styles.signInContainer}>
                <Text style={styles.signInText}>
                  Already have an account?{' '}
                  <Text style={[styles.signInLink, {color: colors.primary}]}>
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
              
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* City Autocomplete Modal */}
        <AutocompleteModal
          visible={cityModalVisible}
          onClose={() => setCityModalVisible(false)}
          title="Select Home City"
          placeholder="Search for your city..."
          fetchOptions={searchCities}
          onSelect={handleCitySelect}
          debounceMs={300}
          minChars={3}
          testID="home-city-autocomplete"
        />
        
        {/* Privacy Policy Modal */}
        <LegalDocumentModal
          visible={privacyModalVisible}
          onClose={() => setPrivacyModalVisible(false)}
          onAccept={handlePrivacyAccept}
          title="Privacy Policy"
          content={PRIVACY_POLICY}
          acceptButtonText="I Accept the Privacy Policy"
          requireScrollToBottom={true}
        />
        
        {/* User Agreement Modal */}
        <LegalDocumentModal
          visible={userAgreementModalVisible}
          onClose={() => setUserAgreementModalVisible(false)}
          onAccept={handleUserAgreementAccept}
          title="User Agreement"
          content={USER_AGREEMENT}
          acceptButtonText="I Accept the User Agreement"
          requireScrollToBottom={true}
        />
      </SafeAreaView>
    </View>
  );
}
