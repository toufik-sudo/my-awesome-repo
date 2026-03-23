import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';

// Screens will be imported from app folder for now
const LoginScreen = require('../../app/(auth)/login').default;
const RegisterScreen = require('../../app/(auth)/register').default;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen 
        name="ForgotPassword" 
        component={LoginScreen} // Placeholder for now
        options={{ title: 'Forgot Password' }}
      />
    </Stack.Navigator>
  );
};
