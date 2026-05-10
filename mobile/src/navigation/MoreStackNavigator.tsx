import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import type { MoreStackParamList } from './types';
import {
  MoreMenuScreen,
  BookingsScreen,
  BookingDetailScreen,
  RewardsScreen,
  RewardDetailScreen,
  ChatScreen,
  ChatDetailScreen,
  PaymentsScreen,
  ReferralsScreen,
  SupportScreen,
  SupportDetailScreen,
  ServiceListingScreen,
  AddServiceScreen,
  SupportNewScreen,
  PayoutAccountsScreen,
  OnboardingScreen,
} from '@/screens';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreStackNavigator: React.FC = () => {
  const { theme } = useTheme();
  const headerOpts = {
    headerShown: true,
    headerStyle: { backgroundColor: theme.card },
    headerTintColor: theme.foreground,
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="MoreMenu" component={MoreMenuScreen} />
      <Stack.Screen name="Bookings" component={BookingsScreen} options={{ ...headerOpts, title: 'Bookings' }} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ ...headerOpts, title: 'Booking' }} />
      <Stack.Screen name="Services" component={ServiceListingScreen} options={{ ...headerOpts, title: 'Services' }} />
      <Stack.Screen name="Rewards" component={RewardsScreen} options={{ ...headerOpts, title: 'Rewards' }} />
      <Stack.Screen name="RewardDetail" component={RewardDetailScreen} options={{ ...headerOpts, title: 'Reward' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ ...headerOpts, title: 'Messages' }} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ ...headerOpts, title: 'Conversation' }} />
      <Stack.Screen name="Payments" component={PaymentsScreen} options={{ ...headerOpts, title: 'Payments' }} />
      <Stack.Screen name="Referrals" component={ReferralsScreen} options={{ ...headerOpts, title: 'Referrals' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ ...headerOpts, title: 'Support' }} />
      <Stack.Screen name="SupportDetail" component={SupportDetailScreen} options={{ ...headerOpts, title: 'Thread' }} />
      <Stack.Screen name="SupportNew" component={SupportNewScreen} options={{ ...headerOpts, title: 'New thread' }} />
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ ...headerOpts, title: 'Add service' }} />
      <Stack.Screen name="PayoutAccounts" component={PayoutAccountsScreen} options={{ ...headerOpts, title: 'Payout accounts' }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ ...headerOpts, title: 'Onboarding' }} />
    </Stack.Navigator>
  );
};
