import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Text, Icon } from '@components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@config';
import styles from './styles';

// Template pages data - organized by categories
const templatePages = [
  {
    category: 'Profile',
    pages: [
      { name: 'Profile1', title: 'Profile 1', icon: 'user' },
      { name: 'Profile2', title: 'Profile 2', icon: 'user' },
      { name: 'Profile3', title: 'Profile 3', icon: 'user' },
      { name: 'Profile4', title: 'Profile 4', icon: 'user' },
      { name: 'Profile5', title: 'Profile 5', icon: 'user' },
      { name: 'Profile6', title: 'Profile 6', icon: 'user' },
      { name: 'Profile7', title: 'Profile 7', icon: 'user' },
      { name: 'Profile8', title: 'Profile 8', icon: 'user' },
      { name: 'ProfileExample', title: 'Profile Example', icon: 'user' },
    ]
  },
  {
    category: 'Travel',
    pages: [
      { name: 'FlightSearch', title: 'Flight Search', icon: 'plane' },
      { name: 'FlightResult', title: 'Flight Result', icon: 'plane' },
      { name: 'FlightFilter', title: 'Flight Filter', icon: 'filter' },
      { name: 'FlightSummary', title: 'Flight Summary', icon: 'file-text' },
      { name: 'FlightTicket', title: 'Flight Ticket', icon: 'ticket' },
      { name: 'SelectFlight', title: 'Select Flight', icon: 'plane' },
      { name: 'Hotel', title: 'Hotel', icon: 'bed' },
      { name: 'HotelDetail', title: 'Hotel Detail', icon: 'bed' },
      { name: 'HotelInformation', title: 'Hotel Information', icon: 'info-circle' },
      { name: 'Car', title: 'Car', icon: 'car' },
      { name: 'CarDetail', title: 'Car Detail', icon: 'car' },
      { name: 'OverViewCar', title: 'Car Overview', icon: 'car' },
      { name: 'BusSearch', title: 'Bus Search', icon: 'bus' },
      { name: 'BusList', title: 'Bus List', icon: 'list' },
      { name: 'BusFilter', title: 'Bus Filter', icon: 'filter' },
      { name: 'BusSelectSeat', title: 'Bus Select Seat', icon: 'chair' },
      { name: 'BusTicket', title: 'Bus Ticket', icon: 'ticket' },
      { name: 'SelectBus', title: 'Select Bus', icon: 'bus' },
      { name: 'Cruise', title: 'Cruise', icon: 'ship' },
      { name: 'CruiseDetail', title: 'Cruise Detail', icon: 'ship' },
      { name: 'CruiseSearch', title: 'Cruise Search', icon: 'search' },
      { name: 'CruiseFilter', title: 'Cruise Filter', icon: 'filter' },
      { name: 'SelectCruise', title: 'Select Cruise', icon: 'ship' },
      { name: 'Tour', title: 'Tour', icon: 'map' },
      { name: 'TourDetail', title: 'Tour Detail', icon: 'map' },
    ]
  },
  {
    category: 'Booking & Events',
    pages: [
      { name: 'Booking', title: 'Booking', icon: 'calendar-check' },
      { name: 'BookingDetail', title: 'Booking Detail', icon: 'file-text' },
      { name: 'PreviewBooking', title: 'Preview Booking', icon: 'eye' },
      { name: 'PreviewBusBooking', title: 'Preview Bus Booking', icon: 'eye' },
      { name: 'PreviewPayment', title: 'Preview Payment', icon: 'credit-card' },
      { name: 'PreviewImage', title: 'Preview Image', icon: 'image' },
      { name: 'Event', title: 'Event', icon: 'calendar' },
      { name: 'EventDetail', title: 'Event Detail', icon: 'calendar' },
      { name: 'EventFilter', title: 'Event Filter', icon: 'filter' },
      { name: 'EventPreviewBooking', title: 'Event Preview Booking', icon: 'eye' },
      { name: 'EventTicket', title: 'Event Ticket', icon: 'ticket' },
      { name: 'DashboardEvent', title: 'Dashboard Event', icon: 'dashboard' },
    ]
  },
  {
    category: 'Payment & Checkout',
    pages: [
      { name: 'CheckOut', title: 'Check Out', icon: 'shopping-cart' },
      { name: 'PaymentMethod', title: 'Payment Method', icon: 'credit-card' },
      { name: 'PaymentMethodDetail', title: 'Payment Method Detail', icon: 'credit-card' },
      { name: 'MyPaymentMethod', title: 'My Payment Method', icon: 'credit-card' },
      { name: 'AddPayment', title: 'Add Payment', icon: 'plus-circle' },
      { name: 'PricingTable', title: 'Pricing Table', icon: 'table' },
      { name: 'PricingTableIcon', title: 'Pricing Table Icon', icon: 'table' },
    ]
  },
  {
    category: 'Content & Social',
    pages: [
      { name: 'Post', title: 'Post', icon: 'file-text' },
      { name: 'PostDetail', title: 'Post Detail', icon: 'file-text' },
      { name: 'Messages', title: 'Messages', icon: 'message-circle' },
      { name: 'Messenger', title: 'Messenger', icon: 'message-square' },
      { name: 'Review', title: 'Review', icon: 'star' },
      { name: 'Feedback', title: 'Feedback', icon: 'message-circle' },
    ]
  },
  {
    category: 'Search & Filter',
    pages: [
      { name: 'Search', title: 'Search', icon: 'search' },
      { name: 'SearchHistory', title: 'Search History', icon: 'clock' },
      { name: 'Filter', title: 'Filter', icon: 'filter' },
    ]
  },
  {
    category: 'Settings & Account',
    pages: [
      { name: 'ChangeLanguage', title: 'Change Language', icon: 'globe' },
      { name: 'ChangePassword', title: 'Change Password', icon: 'lock' },
      { name: 'ResetPassword', title: 'Reset Password', icon: 'lock' },
      { name: 'ThemeSetting', title: 'Theme Setting', icon: 'palette' },
      { name: 'SelectDarkOption', title: 'Select Dark Option', icon: 'moon' },
      { name: 'SelectFontOption', title: 'Select Font Option', icon: 'type' },
      { name: 'Currency', title: 'Currency', icon: 'dollar-sign' },
      { name: 'More', title: 'More', icon: 'more-horizontal' },
    ]
  },
  {
    category: 'Information',
    pages: [
      { name: 'AboutUs', title: 'About Us', icon: 'info' },
      { name: 'ContactUs', title: 'Contact Us', icon: 'phone' },
      { name: 'OurService', title: 'Our Service', icon: 'settings' },
      { name: 'Coupons', title: 'Coupons', icon: 'tag' },
      { name: 'Notification', title: 'Notification', icon: 'bell' },
      { name: 'NotFound', title: 'Not Found', icon: 'alert-triangle' },
    ]
  }
];

export default function TemplatePages({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handlePagePress = (pageName: string) => {
    // Navigate to the template page
    navigation.navigate(pageName);
  };

  const renderCategory = (category) => {
    return (
      <View key={category.category} style={styles.categoryContainer}>
        <Text headline semibold style={[styles.categoryTitle, { color: colors.text }]}>
          {category.category}
        </Text>
        <View style={styles.pagesGrid}>
          {category.pages.map((page) => (
            <TouchableOpacity
              key={page.name}
              style={[styles.pageButton, { backgroundColor: colors.card }]}
              onPress={() => handlePagePress(page.name)}
            >
              <Icon
                name={page.icon}
                size={24}
                color={colors.primary}
                style={styles.pageIcon}
              />
              <Text
                caption1
                semibold
                style={[styles.pageTitle, { color: colors.text }]}
                numberOfLines={2}
              >
                {page.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('template_pages')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView style={styles.content}>
        <Text body1 grayColor style={styles.description}>
          {t('template_pages_description')}
        </Text>
        {templatePages.map(renderCategory)}
      </ScrollView>
    </View>
  );
} 