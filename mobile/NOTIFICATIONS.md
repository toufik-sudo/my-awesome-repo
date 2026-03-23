# Push Notifications & Deep Linking - Complete Implementation

## Overview
This document covers the complete push notification and deep linking system implementation for the mobile app.

## Architecture

### 1. Notification Service
**File**: `mobile/src/services/notification.service.ts`

A singleton service that handles all notification operations:
- Permission management
- Expo push token retrieval
- Android notification channels
- Local notification scheduling
- Badge count management
- Notification listeners

```typescript
import { notificationService } from '@/services/notification.service';

// Get push token
const token = await notificationService.getExpoPushToken();

// Schedule notification
await notificationService.scheduleLocalNotification(
  'Title',
  'Body',
  { screen: 'NotificationDetail', id: '123' },
  5 // delay in seconds
);
```

### 2. Deep Linking Configuration
**File**: `mobile/src/navigation/linking.ts`

Configures URL scheme and route mapping:
- URL scheme: `huggithub://`
- Handles notification taps
- Maps URLs to navigation screens
- Supports nested navigation

**Example URLs**:
- `huggithub://notifications/123` → NotificationDetail screen
- `huggithub://details/456` → Home Details screen
- `huggithub://profile` → Profile screen

### 3. Notification Hook
**File**: `mobile/src/hooks/useNotifications.ts`

React hook that initializes and manages notifications:
- Sets up listeners on mount
- Handles notification received events
- Routes navigation based on notification data
- Cleans up on unmount

### 4. Screens

#### NotificationDetailScreen
**File**: `mobile/src/screens/NotificationDetailScreen.tsx`

Displays full notification details with:
- Title, body, timestamp
- Read/unread status
- Additional data payload
- Mark as read action
- Delete action

#### NotificationTestScreen
**File**: `mobile/src/screens/NotificationTestScreen.tsx`

Developer testing utility with:
- Device info display
- Push token viewer
- Custom notification scheduler
- Deep link testers
- Badge count management

## Usage

### Sending Push Notifications

#### From Backend (Remote)
```typescript
// Send to Expo Push API
POST https://exp.host/--/api/v2/push/send
{
  "to": "ExponentPushToken[...]",
  "title": "New Message",
  "body": "You have a new message",
  "data": {
    "screen": "NotificationDetail",
    "id": "123",
    "url": "huggithub://notifications/123"
  }
}
```

#### Local (Testing)
```typescript
import { notificationService } from '@/services/notification.service';

await notificationService.scheduleLocalNotification(
  'Test Title',
  'Test Body',
  {
    screen: 'NotificationDetail',
    id: '123',
    url: 'huggithub://notifications/123'
  },
  0 // send immediately
);
```

### Navigation Routing

Notifications should include routing data:
```json
{
  "data": {
    "screen": "NotificationDetail",
    "id": "123",
    "url": "huggithub://notifications/123"
  }
}
```

Supported screens:
- `NotificationDetail` - requires `id` parameter
- `Details` - requires `id` parameter
- `Profile` - no parameters
- `Settings` - no parameters
- `EditProfile` - no parameters

### Badge Management

```typescript
import { notificationService } from '@/services/notification.service';

// Get current badge count
const count = await notificationService.getBadgeCount();

// Set badge count
await notificationService.setBadgeCount(5);

// Clear badge
await notificationService.clearBadgeCount();
```

## Configuration

### app.json
- URL scheme: `huggithub`
- Notification permissions configured
- iOS & Android platform settings

### Dependencies
- `expo-notifications` - Push notification handling
- `expo-device` - Device type detection
- `expo-linking` - Deep link handling
- `@react-navigation/native` - Navigation framework

## Testing

### Using NotificationTestScreen

1. **View Push Token**
   - Copy token for backend testing
   - Only works on physical devices

2. **Schedule Test Notifications**
   - Customize title, body, delay
   - Test immediate or scheduled delivery

3. **Test Deep Links**
   - Pre-configured buttons for each screen
   - Automatically schedules and navigates

4. **Badge Testing**
   - Increment/clear badge count
   - Verify badge display on app icon

### Manual Testing Checklist

- [ ] Permission request on first launch
- [ ] Push token retrieved successfully
- [ ] Foreground notification display
- [ ] Background notification tap
- [ ] Deep link navigation to correct screen
- [ ] Badge count updates
- [ ] Android notification channels
- [ ] iOS notification grouping

## Integration with Backend

### 1. Register Push Token
When user logs in, send push token to backend:
```typescript
const token = await notificationService.getExpoPushToken();
await api.updateUserPushToken(token);
```

### 2. Backend Sends Notifications
```typescript
// Node.js example using expo-server-sdk
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const messages = [{
  to: userPushToken,
  sound: 'default',
  title: 'New Message',
  body: 'You have a new message',
  data: {
    screen: 'NotificationDetail',
    id: messageId,
    url: `huggithub://notifications/${messageId}`
  }
}];

await expo.sendPushNotificationsAsync(messages);
```

### 3. Handle Navigation
The app automatically handles navigation when users tap notifications.

## Best Practices

1. **Always include deep link data** in notifications
2. **Test on physical devices** (simulators have limitations)
3. **Handle permission denial** gracefully
4. **Clear badges** after user views notifications
5. **Use notification channels** on Android for categorization
6. **Schedule notifications** with appropriate delays
7. **Clean up listeners** to prevent memory leaks

## Troubleshooting

### Token not generating
- Ensure running on physical device
- Check internet connection
- Verify app.json configuration

### Notifications not appearing
- Check permission status
- Verify notification handler configuration
- Test on physical device

### Deep links not working
- Verify URL scheme in app.json
- Check linking configuration
- Ensure navigation structure matches

### Badge count not updating
- iOS: Requires notification permissions
- Android: Not all launchers support badges

## Next Steps

1. Connect to backend API
2. Implement real notification data fetching
3. Add notification preferences
4. Implement notification categories/filters
5. Add sound customization
6. Implement notification grouping
