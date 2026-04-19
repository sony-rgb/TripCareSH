import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions} from '../../actions';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import { container } from '@services';
import AuthService from '../../services/AuthService';

export default function Profile({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userData, setUserData] = useState({
    image: '',
    name: '',
    address: '',
    email: '',
  });
  const dispatch = useDispatch();

  // Reload user data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      setLoadingUser(true);
      console.log('🔍 [Profile] Loading user data from local database...');
      
      const user = await container.getUserService().getCurrentUser();
      
      if (user) {
        console.log('✅ [Profile] User data loaded from local DB:', {
          id: user.id,
          name: user.name,
          email: user.email,
          homeCityId: user.homeCityId,
          homeCityName: user.homeCityName,
        });
        
        setUserData({
          image: '',
          name: user.name || '',
          address: user.homeCityName || user.homeCityId || t('home_city'),
          email: user.email || '',
        });
      } else {
        console.warn('⚠️ [Profile] No user found in local database, fetching from server...');
        // If no user in database, try to fetch from server
        const fetchedUser = await container.getUserService().fetchAndStoreUserProfile();
        if (fetchedUser) {
          console.log('✅ [Profile] User data fetched and stored from server:', {
            id: fetchedUser.id,
            name: fetchedUser.name,
            email: fetchedUser.email,
          });
          
          setUserData({
            image: '',
            name: fetchedUser.name || '',
            address: fetchedUser.homeCityName || fetchedUser.homeCityId || t('home_city'),
            email: fetchedUser.email || '',
          });
        } else {
          console.error('❌ [Profile] Failed to load user data from local DB or server');
        }
      }
    } catch (error) {
      console.error('❌ [Profile] Error loading user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  /**
   * @description Logout with proper cleanup and navigation
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = async () => {
    setLoading(true);
    try {
      // Clear tokens and user data from AuthService
      await AuthService.signOut();
      
      // Update Redux state
      dispatch(AuthActions.logout(() => {
        setLoading(false);
        // Navigate back to SignIn screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }));
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
      // Even if there's an error, still logout locally
      dispatch(AuthActions.logout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }));
    }
  };

  const onResetPassword = async () => {
    // navigation.navigate('ResetPassword');
    try {
      const resp = await container.getUserService().resetPassword(userData.email);
      if(resp) {
          alert('Password reset email sent');
        } 
      } catch (error) {
        console.error(error);
    }
  };

  // Show loading state while fetching user data
  if (loadingUser) {
    return (
      <View style={{flex: 1}}>
        <Header title={t('profile')} />
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{t('loading')}...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('profile')}
        // renderRight={() => {
        //   return <Icon name="bell" size={24} color={colors.primary} />;
        // }}
        // onPressRight={() => {
        //   navigation.navigate('Notification');
        // }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <View style={styles.contain}>
            <ProfileDetail
              icon={false}
              image={userData.image}
              textFirst={userData.name}
              // point={userData.point}
              textSecond={userData.address}
              // textThird={userData.id}
              // onPress={() => navigation.navigate('ProfileExanple')}
            />
            {/* <ProfilePerformance
              data={userData.performance}
              style={{marginTop: 20, marginBottom: 20}}
            /> */}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
                {marginTop: 40},
              ]}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}>
              <Text body1>{t('edit_profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                onResetPassword();
                // navigation.navigate('ChangePassword');
              }}>
              <Text body1>{t('change_password')}</Text>
              {/* <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              /> */}
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('Currency');
              }}>
              <Text body1>{t('currency')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text body1 grayColor>
                  USD
                </Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => navigation.navigate('MyPaymentMethod')}>
              <Text body1>{t('my_cards')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.profileItem}
              onPress={() => {
                navigation.navigate('Setting');
              }}>
              <Text body1>{t('setting')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={() => onLogOut()}>
            {t('sign_out')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
