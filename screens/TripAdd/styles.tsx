import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
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
    top: 0,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  // Description Field
  descriptionContainer: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
  },
  descriptionInput: {
    height: 150,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
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
  
  // DatePicker Override
  datePickerContainer: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 0,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  
  // Create/Update Button
  createButton: {
    marginTop: 8,
    marginBottom: 20,
    height: 56,
    borderRadius: 28,
  },
});