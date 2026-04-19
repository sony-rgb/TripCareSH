import React, {useEffect} from 'react';
import {StatusBar, Platform, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useTheme, BaseSetting} from '../config';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {useSelector} from 'react-redux';

/* Main Stack Navigator */
import Main from './main';
/* Modal Screen only affect iOS */
import Loading from '../screens/Loading';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import SignUpSuccess from '../screens/SignUp/success';
import ResetPassword from '../screens/ResetPassword';
import RequiresOnline from '../screens/RequiresOnline';
import Filter from '../screens/_template/Filter';
import FlightFilter from '../screens/_template/FlightFilter';
import BusFilter from '../screens/_template/BusFilter';
import Search from '../screens/_template/Search';
import SearchHistory from '../screens/_template/SearchHistory';
import PreviewImage from '../screens/_template/PreviewImage';
import SelectBus from '../screens/_template/SelectBus';
import SelectCruise from '../screens/_template/SelectCruise';
import CruiseFilter from '../screens/_template/CruiseFilter';
import EventFilter from '../screens/_template/EventFilter';
import SelectDarkOption from '../screens/_template/SelectDarkOption';
import SelectFontOption from '../screens/_template/SelectFontOption';
import TripAdd from '../screens/TripAdd';
import Trips from '../screens/Trips';

const RootStack = createStackNavigator();

export default function Navigator(): React.ReactElement {
  const language = useSelector((state: any) => state.application.language);
  const auth = useSelector((state: any) => state.auth);
  const isLoggedIn = auth.login.success;
  const {theme, colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  /**
   * init language
   */
  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
      compatibilityJSON: 'v3',
    });
  }, []);

  /**
   * when reducer language change
   */
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  /**
   * when theme change
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#FFFFFF', true);
      StatusBar.setTranslucent(false);
    }
    StatusBar.setBarStyle('dark-content', true);
  }, [colors.primary, isDarkMode]);

  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Loading">
        <RootStack.Screen
          name="Loading"
          component={Loading}
          options={{gestureEnabled: false}}
        />
        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="SignUpSuccess" component={SignUpSuccess} />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
        <RootStack.Screen name="RequiresOnline" component={RequiresOnline} />
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen name="Filter" component={Filter} />
        <RootStack.Screen name="FlightFilter" component={FlightFilter} />
        <RootStack.Screen name="BusFilter" component={BusFilter} />
        <RootStack.Screen name="Search" component={Search} />
        <RootStack.Screen name="SearchHistory" component={SearchHistory} />
        <RootStack.Screen name="PreviewImage" component={PreviewImage} />
        <RootStack.Screen name="SelectBus" component={SelectBus} />
        <RootStack.Screen name="SelectCruise" component={SelectCruise} />
        <RootStack.Screen name="CruiseFilter" component={CruiseFilter} />
        <RootStack.Screen name="EventFilter" component={EventFilter} />
        <RootStack.Screen name="TripAdd" component={TripAdd} />
        <RootStack.Screen name="Trips" component={Trips} />
        <RootStack.Screen
          name="SelectDarkOption"
          component={SelectDarkOption}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen
          name="SelectFontOption"
          component={SelectFontOption}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
} 