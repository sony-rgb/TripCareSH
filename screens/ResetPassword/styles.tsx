import {StyleSheet} from 'react-native';
import {BaseColor, BaseStyle} from '@config';

/**
 * Styles for the Reset Password screen matching the password-reset.png mockup.
 * 
 * Design features:
 * - Centered title and logo
 * - Email input with label
 * - Helper text below input
 * - Full-width pill-shaped button
 * - Consistent with SignIn/SignUp styling
 */
export default StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E232C',
    marginBottom: 24,
    textAlign: 'center',
  },
  logo: {
    marginBottom: 8,
  },
  
  // Form Section
  formSection: {
    width: '100%',
  },
  
  // Input Field
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E232C',
    marginBottom: 8,
  },
  textInput: {
    ...BaseStyle.textInput,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 45,
    fontSize: 15,
    color: '#1E232C',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    bottom: 13,
    zIndex: 1,
  },
  
  // Helper Text
  helperText: {
    fontSize: 13,
    color: '#6A707C',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  
  // Messages
  messageContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successContainer: {
    backgroundColor: '#D1FAE5',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Error Text
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  // Reset Button
  resetButton: {
    marginTop: 8,
    height: 56,
    borderRadius: 28,
  },
});

