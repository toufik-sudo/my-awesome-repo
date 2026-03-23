import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import type { ProfileStackParamList } from './types';
import { SettingsScreen, VerificationReviewScreen } from '@/screens';

const ProfileScreen = require('../../app/(tabs)/profile').default;

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.foreground,
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={ProfileScreen}
        options={{ title: 'Edit Profile', headerShown: true }}
      />
      <Stack.Screen 
        name="VerificationReview" 
        component={VerificationReviewScreen}
        options={{ 
          title: 'Verification Review',
          headerShown: true,
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.foreground,
        }}
      />
    </Stack.Navigator>
  );
};
