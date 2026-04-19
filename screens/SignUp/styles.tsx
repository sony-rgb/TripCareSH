import {StyleSheet} from 'react-native';

/**
 * Styles for the Sign Up screen matching the registration mockup.
 * 
 * Design features:
 * - Centered title and logo
 * - Vertical stack of full-width form fields
 * - White input backgrounds with darker borders
 * - Rounded corners (12px)
 * - Clear icons inside inputs
 * - Terms checkbox with clickable links
 * - Pill-shaped "Create an Account" button
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
    marginBottom: 32,
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
  
  // Input Fields
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E232C',
    marginBottom: 8,
  },
  textInput: {
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
    top: 30,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  // Terms & Policies Section
  termsSection: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  termsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  acceptedIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  termsLinkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsLinkText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  termsAcceptedText: {
    textDecorationLine: 'none',
  },
  acceptedLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: '#6A707C',
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  termsHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Error Messages
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Create Account Button
  createButton: {
    marginTop: 8,
    marginBottom: 20,
    height: 56,
    borderRadius: 28,
  },
  
  // Sign In Link
  signInContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  signInText: {
    fontSize: 15,
    color: '#6A707C',
  },
  signInLink: {
    fontWeight: '600',
  },
  
  // Success Screen Styles
  successScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: '100%',
  },
  successHeaderSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successLogo: {
    marginBottom: 8,
  },
  contentSection: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E232C',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6A707C',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E232C',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6A707C',
    lineHeight: 20,
  },
  signInButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    marginBottom: 24,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#6A707C',
    textAlign: 'center',
    lineHeight: 20,
  },
  helpLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
