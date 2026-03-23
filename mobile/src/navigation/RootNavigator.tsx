import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/Loading';
import { useNotifications } from '@/hooks/useNotifications';
import type { RootStackParamList } from './types';
import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { CreatePostModal, ImageViewerModal, ConfirmationModal } from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Initialize notification listeners (only for authenticated users)
  useNotifications();

  if (loading) {
    return <Loading fullScreen visible text="Loading..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          {/* Modal screens */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen 
              name="CreatePostModal" 
              component={CreatePostModal}
              options={{ title: 'Create Post' }}
            />
            <Stack.Screen 
              name="ImageViewerModal" 
              component={ImageViewerModal}
              options={{ 
                title: 'Image Viewer',
                headerShown: true,
                animation: 'fade',
              }}
            />
            <Stack.Screen 
              name="ConfirmationModal" 
              component={ConfirmationModal}
              options={{ 
                title: 'Confirm',
                presentation: 'transparentModal',
                animation: 'fade',
              }}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};
