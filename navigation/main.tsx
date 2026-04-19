import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {BaseColor, useTheme, useFont} from '../config';
import {useTranslation} from 'react-i18next';
import {Icon} from '../components';
/* Stack Screen */
import Profile1 from '../screens/_template/Profile1';
import Profile2 from '../screens/_template/Profile2';
import Profile3 from '../screens/_template/Profile3';
import Profile4 from '../screens/_template/Profile4';
import Profile5 from '../screens/_template/Profile5';
import Profile6 from '../screens/_template/Profile6';
import Profile7 from '../screens/_template/Profile7';
import Profile8 from '../screens/_template/Profile8';
import More from '../screens/_template/More';
import Tour from '../screens/_template/Tour';
import Car from '../screens/_template/Car';
import OverViewCar from '../screens/_template/OverViewCar';
import Hotel from '../screens/_template/Hotel';
import Review from '../screens/_template/Review';
import Feedback from '../screens/_template/Feedback';
import Messages from '../screens/_template/Messages';
import Notification from '../screens/_template/Notification';
import Walkthrough from '../screens/Walkthrough';
import ChangePassword from '../screens/_template/ChangePassword';
import ProfileEdit from '../screens/ProfileEdit';
import ProfileExample from '../screens/_template/ProfileExample';
import ChangeLanguage from '../screens/_template/ChangeLanguage';
import HotelInformation from '../screens/_template/HotelInformation';
import CheckOut from '../screens/_template/CheckOut';
import Currency from '../screens/_template/Currency';
import Coupons from '../screens/_template/Coupons';
import HotelDetail from '../screens/_template/HotelDetail';
import ContactUs from '../screens/_template/ContactUs';
import PreviewBooking from '../screens/_template/PreviewBooking';
import PricingTable from '../screens/_template/PricingTable';
import PricingTableIcon from '../screens/_template/PricingTableIcon';
import BookingDetail from '../screens/_template/BookingDetail';
import PostDetail from '../screens/_template/PostDetail';
import TourDetail from '../screens/_template/TourDetail';
import CarDetail from '../screens/_template/CarDetail';
import AboutUs from '../screens/_template/AboutUs';
import OurService from '../screens/_template/OurService';
import FlightSearch from '../screens/_template/FlightSearch';
import SelectFlight from '../screens/_template/SelectFlight';
import FlightResult from '../screens/_template/FlightResult';
import FlightSummary from '../screens/_template/FlightSummary';
import FlightTicket from '../screens/_template/FlightTicket';
import CruiseSearch from '../screens/_template/CruiseSearch';
import Cruise from '../screens/_template/Cruise';
import CruiseDetail from '../screens/_template/CruiseDetail';
import BusSearch from '../screens/_template/BusSearch';
import BusList from '../screens/_template/BusList';
import BusSelectSeat from '../screens/_template/BusSelectSeat';
import PreviewBusBooking from '../screens/_template/PreviewBusBooking';
import BusTicket from '../screens/_template/BusTicket';
import Event from '../screens/_template/Event';
import EventDetail from '../screens/_template/EventDetail';
import EventPreviewBooking from '../screens/_template/EventPreviewBooking';
import DashboardEvent from '../screens/_template/DashboardEvent';
import EventTicket from '../screens/_template/EventTicket';
import PaymentMethod from '../screens/_template/PaymentMethod';
import MyPaymentMethod from '../screens/_template/MyPaymentMethod';
import AddPayment from '../screens/_template/AddPayment';
import PaymentMethodDetail from '../screens/_template/PaymentMethodDetail';
import PreviewPayment from '../screens/_template/PreviewPayment';
import Setting from '../screens/Setting';
import ThemeSetting from '../screens/_template/ThemeSetting';
import ResetPassword from '../screens/ResetPassword';
import Search from '../screens/_template/Search';
import SearchHistory from '../screens/_template/SearchHistory';
import SelectBus from '../screens/_template/SelectBus';
import SelectCruise from '../screens/_template/SelectCruise';
import SelectDarkOption from '../screens/_template/SelectDarkOption';
import SelectFontOption from '../screens/_template/SelectFontOption';
import BusFilter from '../screens/_template/BusFilter';
import CruiseFilter from '../screens/_template/CruiseFilter';
import EventFilter from '../screens/_template/EventFilter';
import FlightFilter from '../screens/_template/FlightFilter';
import Filter from '../screens/_template/Filter';
import PreviewImage from '../screens/_template/PreviewImage';
import NotFound from '../screens/_template/NotFound';
import TripAdd from '../screens/TripAdd';
import TripDetails from '../screens/TripDetails';
import TemplatePages from '../screens/TemplatePages';
import ActivityAdd from '../screens/ActivityAdd';
import ActivityEdit from '../screens/ActivityEdit';
/* Bottom Screen */
import Home from '../screens/Home';
import Booking from '../screens/_template/Booking';
import Messenger from '../screens/_template/Messenger';
import Post from '../screens/_template/Post';
import Profile from '../screens/Profile';
import Trips from '../screens/Trips';
import FlightAdd from '../screens/FlightAdd';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main(): React.ReactElement {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabNavigator">
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="Profile1" component={Profile1} />
      <MainStack.Screen name="Profile2" component={Profile2} />
      <MainStack.Screen name="Profile3" component={Profile3} />
      <MainStack.Screen name="Profile4" component={Profile4} />
      <MainStack.Screen name="Profile5" component={Profile5} />
      <MainStack.Screen name="Profile6" component={Profile6} />
      <MainStack.Screen name="Profile7" component={Profile7} />
      <MainStack.Screen name="Profile8" component={Profile8} />
      <MainStack.Screen name="More" component={More} />
      <MainStack.Screen name="Tour" component={Tour} />
      <MainStack.Screen name="Car" component={Car} />
      <MainStack.Screen name="OverViewCar" component={OverViewCar} />
      <MainStack.Screen name="Hotel" component={Hotel} />
      <MainStack.Screen name="Review" component={Review} />
      <MainStack.Screen name="Feedback" component={Feedback} />
      <MainStack.Screen name="Messages" component={Messages} />
      <MainStack.Screen name="Notification" component={Notification} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ProfileExample" component={ProfileExample} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="HotelInformation" component={HotelInformation} />
      <MainStack.Screen name="CheckOut" component={CheckOut} />
      <MainStack.Screen name="Currency" component={Currency} />
      <MainStack.Screen name="Coupons" component={Coupons} />
      <MainStack.Screen name="HotelDetail" component={HotelDetail} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="PreviewBooking" component={PreviewBooking} />
      <MainStack.Screen name="PricingTable" component={PricingTable} />
      <MainStack.Screen name="PricingTableIcon" component={PricingTableIcon} />
      <MainStack.Screen name="BookingDetail" component={BookingDetail} />
      <MainStack.Screen name="PostDetail" component={PostDetail} />
      <MainStack.Screen name="TourDetail" component={TourDetail} />
      <MainStack.Screen name="CarDetail" component={CarDetail} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      <MainStack.Screen name="OurService" component={OurService} />
      <MainStack.Screen name="FlightSearch" component={FlightSearch} />
      <MainStack.Screen name="SelectFlight" component={SelectFlight} />
      <MainStack.Screen name="FlightResult" component={FlightResult} />
      <MainStack.Screen name="FlightSummary" component={FlightSummary} />
      <MainStack.Screen name="FlightTicket" component={FlightTicket} />
      <MainStack.Screen name="CruiseSearch" component={CruiseSearch} />
      <MainStack.Screen name="Cruise" component={Cruise} />
      <MainStack.Screen name="CruiseDetail" component={CruiseDetail} />
      <MainStack.Screen name="BusSearch" component={BusSearch} />
      <MainStack.Screen name="BusList" component={BusList} />
      <MainStack.Screen name="BusSelectSeat" component={BusSelectSeat} />
      <MainStack.Screen
        name="PreviewBusBooking"
        component={PreviewBusBooking}
      />
      <MainStack.Screen name="BusTicket" component={BusTicket} />
      <MainStack.Screen name="Event" component={Event} />
      <MainStack.Screen name="EventDetail" component={EventDetail} />
      <MainStack.Screen
        name="EventPreviewBooking"
        component={EventPreviewBooking}
      />
      <MainStack.Screen name="DashboardEvent" component={DashboardEvent} />
      <MainStack.Screen name="EventTicket" component={EventTicket} />
      <MainStack.Screen name="PaymentMethod" component={PaymentMethod} />
      <MainStack.Screen name="MyPaymentMethod" component={MyPaymentMethod} />
      <MainStack.Screen name="AddPayment" component={AddPayment} />
      <MainStack.Screen
        name="PaymentMethodDetail"
        component={PaymentMethodDetail}
      />
      <MainStack.Screen name="PreviewPayment" component={PreviewPayment} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen name="ResetPassword" component={ResetPassword} />
      <MainStack.Screen name="Search" component={Search} />
      <MainStack.Screen name="SearchHistory" component={SearchHistory} />
      <MainStack.Screen name="SelectBus" component={SelectBus} />
      <MainStack.Screen name="SelectCruise" component={SelectCruise} />
      <MainStack.Screen name="SelectDarkOption" component={SelectDarkOption} />
      <MainStack.Screen name="SelectFontOption" component={SelectFontOption} />
      <MainStack.Screen name="BusFilter" component={BusFilter} />
      <MainStack.Screen name="CruiseFilter" component={CruiseFilter} />
      <MainStack.Screen name="EventFilter" component={EventFilter} />
      <MainStack.Screen name="FlightFilter" component={FlightFilter} />
      <MainStack.Screen name="Filter" component={Filter} />
      <MainStack.Screen name="PreviewImage" component={PreviewImage} />
      <MainStack.Screen name="NotFound" component={NotFound} />
      <MainStack.Screen name="TripAdd" component={TripAdd} />
      <MainStack.Screen name="TripDetails" component={TripDetails} />
      <MainStack.Screen name="TemplatePages" component={TemplatePages} />
      <MainStack.Screen name="FlightAdd" component={FlightAdd} />
      <MainStack.Screen name="ActivityAdd" component={ActivityAdd} />
      <MainStack.Screen name="ActivityEdit" component={ActivityEdit} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator(): React.ReactElement {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const font = useFont();
  const auth = useSelector((state: any) => state.auth);
  const login = auth.login.success;

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          height: 55,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
          paddingBottom: 2,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('home'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="My Trips"
        component={Trips}
        options={{
          title: t('my_trips'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="suitcase-rolling" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Messenger"
        component={Messenger}
        options={{
          title: t('message'),
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="envelope" size={20} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Post"
        component={Post}
        options={{
          title: t('news'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="copy" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={login ? Profile : Walkthrough}
        options={{
          title: t('account'),
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="user-circle" size={20} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
} 