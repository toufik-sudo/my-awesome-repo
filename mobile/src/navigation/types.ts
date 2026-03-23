import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tabs
export type MainTabParamList = {
  HomeTab: undefined;
  PropertiesTab: undefined;
  SearchTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

// Home Stack
export type HomeStackParamList = {
  Home: undefined;
  Details: { id: string };
};

// Properties Stack
export type PropertiesStackParamList = {
  PropertyListing: undefined;
  PropertyDetail: { propertyId: string };
  DocumentUpload: { propertyId: string };
};

// Search Stack
export type SearchStackParamList = {
  Search: undefined;
  SearchResults: { query: string };
};

// Notifications Stack
export type NotificationsStackParamList = {
  Notifications: undefined;
  NotificationDetail: { id: string };
};

// Profile Stack
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  VerificationReview: undefined; // Admin only
};

// Root Stack (includes modals)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Modal screens
  CreatePostModal: undefined;
  ImageViewerModal: { imageUrl: string };
  ConfirmationModal: {
    title: string;
    message: string;
    onConfirm: () => void;
  };
};

// Navigation prop types
export type AuthStackNavigationProp = NativeStackScreenProps<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabScreenProps<MainTabParamList>;
export type RootStackNavigationProp = NativeStackScreenProps<RootStackParamList>;
export type PropertiesStackNavigationProp = NativeStackScreenProps<PropertiesStackParamList>;

// Declare global types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
