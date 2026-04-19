import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E232C',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6A707C',
    marginBottom: 32,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  formSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1E232C',
    marginBottom: 24,
    textAlign: 'center',
  },
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
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 12,
    padding: 10,
    paddingRight: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    bottom: 13,
    zIndex: 1,
  },
  errorText: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  signInButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#69b6e6',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6A707C',
  },
  spacer: {
    flex: 1,
  },
  signUpContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  signUpText: {
    fontSize: 15,
    color: '#1E232C',
  },
  signUpLink: {
    color: '#69b6e6',
    fontWeight: '600',
  },
});
