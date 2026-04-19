import { Alert } from 'react-native';
import { AuthActions } from '@actions';
import { Unauthorized } from '../exceptions/Unauthorized';

export const handleUnauthorizedError = (error: any, dispatch: any, navigation: any): boolean => {
  if (error instanceof Unauthorized) {
    Alert.alert(
      'Session Expired',
      'Please sign in again to continue',
      [
        {
          text: 'Sign In',
          onPress: () => {
            dispatch(AuthActions.authentication(false));
            navigation.navigate('SignIn');
          }
        }
      ]
    );
    return true;
  }
  return false;
};
