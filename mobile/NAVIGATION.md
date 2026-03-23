# Mobile App Navigation Setup

## React Navigation Structure

The mobile app now uses **React Navigation** with the following structure:

### Navigation Hierarchy

```
RootNavigator (Stack)
├── Auth Stack (when not authenticated)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
│
└── Main Stack (when authenticated)
    ├── MainTabNavigator (Bottom Tabs)
    │   ├── HomeTab (Stack)
    │   │   ├── Home
    │   │   └── Details
    │   ├── SearchTab (Stack)
    │   │   ├── Search
    │   │   └── SearchResults
    │   ├── NotificationsTab (Stack)
    │   │   ├── Notifications
    │   │   └── NotificationDetail
    │   └── ProfileTab (Stack)
    │       ├── Profile
    │       ├── Settings
    │       └── EditProfile
    │
    └── Modal Screens
        ├── CreatePostModal
        ├── ImageViewerModal
        └── ConfirmationModal
```

### Key Features

1. **Bottom Tab Navigation** with 4 tabs: Home, Search, Notifications, Profile
2. **Stack Navigation** within each tab for nested screens
3. **Modal Screens** for overlays and confirmations
4. **Authentication Flow** that switches between Auth and Main based on user state
5. **Type-safe Navigation** with TypeScript

### Usage Examples

#### Navigate to a screen
```typescript
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

// Navigate to a modal with params
navigation.navigate('ImageViewerModal', { imageUrl: 'https://...' });
```

#### Navigate within a tab stack
```typescript
// From Home screen to Details
navigation.navigate('Details', { id: '123' });
```

#### Open a confirmation modal
```typescript
navigation.navigate('ConfirmationModal', {
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  onConfirm: () => {
    // Handle deletion
  }
});
```

### Files Structure

- `mobile/src/navigation/types.ts` - TypeScript types for all navigators
- `mobile/src/navigation/RootNavigator.tsx` - Main app navigator
- `mobile/src/navigation/AuthStackNavigator.tsx` - Auth flow navigator
- `mobile/src/navigation/MainTabNavigator.tsx` - Bottom tabs navigator
- `mobile/src/navigation/HomeStackNavigator.tsx` - Home tab stack
- `mobile/src/navigation/ProfileStackNavigator.tsx` - Profile tab stack
- `mobile/src/screens/` - All screen components
- `mobile/App.tsx` - App entry point with NavigationContainer

### Migration from Expo Router

The app has been migrated from Expo Router (file-based routing) to React Navigation for:
- More control over navigation structure
- Better support for complex navigation patterns
- Easier integration with existing navigation libraries
- Type-safe navigation with TypeScript
