import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import type { MainTabParamList, SearchStackParamList, NotificationsStackParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { PropertiesStackNavigator } from './PropertiesStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { SearchScreen, NotificationsScreen, NotificationDetailScreen } from '@/screens';

const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const NotificationsStack = createNativeStackNavigator<NotificationsStackParamList>();

const SearchStackNavigator = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="Search" component={SearchScreen} />
  </SearchStack.Navigator>
);

const NotificationsStackNavigator = () => (
  <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
    <NotificationsStack.Screen name="Notifications" component={NotificationsScreen} />
    <NotificationsStack.Screen 
      name="NotificationDetail" 
      component={NotificationDetailScreen}
      options={{ 
        title: 'Notification',
        headerShown: true,
      }}
    />
  </NotificationsStack.Navigator>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="PropertiesTab"
        component={PropertiesStackNavigator}
        options={{
          title: t('tabs.properties', 'Properties'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏡</Text>,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          title: t('tabs.search', 'Search'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStackNavigator}
        options={{
          title: t('tabs.notifications', 'Notifications'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔔</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
