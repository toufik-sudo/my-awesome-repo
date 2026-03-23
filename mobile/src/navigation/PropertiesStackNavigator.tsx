import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import type { PropertiesStackParamList } from './types';
import { PropertyListingScreen, PropertyDetailScreen } from '@/screens';

const Stack = createNativeStackNavigator<PropertiesStackParamList>();

export const PropertiesStackNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen 
        name="PropertyListing" 
        component={PropertyListingScreen}
        options={{ title: 'Properties' }}
      />
      <Stack.Screen 
        name="PropertyDetail" 
        component={PropertyDetailScreen}
        options={{ 
          title: 'Property Details',
          headerShown: true,
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.foreground,
        }}
      />
    </Stack.Navigator>
  );
};
