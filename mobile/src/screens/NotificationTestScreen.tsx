import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { notificationService } from '@/services/notification.service';
import * as Device from 'expo-device';

export const NotificationTestScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test notification');
  const [delaySeconds, setDelaySeconds] = useState('0');
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    loadPushToken();
    loadBadgeCount();
  }, []);

  const loadPushToken = async () => {
    const token = await notificationService.getExpoPushToken();
    setPushToken(token);
  };

  const loadBadgeCount = async () => {
    const count = await notificationService.getBadgeCount();
    setBadgeCount(count);
  };

  const handleScheduleNotification = async () => {
    try {
      const delay = parseInt(delaySeconds) || 0;
      
      const id = await notificationService.scheduleLocalNotification(
        title,
        body,
        {
          screen: 'NotificationDetail',
          id: 'test-' + Date.now(),
          url: 'huggithub://notifications/test-123',
        },
        delay
      );
      
      setNotificationId(id);
      Alert.alert(
        'Success',
        delay > 0 
          ? `Notification scheduled for ${delay} seconds from now`
          : 'Notification sent immediately'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
      console.error(error);
    }
  };

  const handleScheduleWithDeepLink = async (screen: string, id?: string) => {
    try {
      let url = `huggithub://${screen}`;
      if (id) {
        url += `/${id}`;
      }

      await notificationService.scheduleLocalNotification(
        `Navigate to ${screen}`,
        `Tap to open ${screen}`,
        {
          screen,
          id: id || 'test',
          url,
        },
        2
      );
      
      Alert.alert('Success', `Notification will navigate to ${screen} in 2 seconds`);
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
      console.error(error);
    }
  };

  const handleCancelNotification = async () => {
    if (!notificationId) {
      Alert.alert('Error', 'No notification to cancel');
      return;
    }

    try {
      await notificationService.cancelNotification(notificationId);
      Alert.alert('Success', 'Notification cancelled');
      setNotificationId(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel notification');
      console.error(error);
    }
  };

  const handleCancelAll = async () => {
    try {
      await notificationService.cancelAllNotifications();
      Alert.alert('Success', 'All notifications cancelled');
      setNotificationId(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel notifications');
      console.error(error);
    }
  };

  const handleIncrementBadge = async () => {
    const newCount = badgeCount + 1;
    await notificationService.setBadgeCount(newCount);
    setBadgeCount(newCount);
  };

  const handleClearBadge = async () => {
    await notificationService.clearBadgeCount();
    setBadgeCount(0);
  };

  const handleDismissAll = async () => {
    try {
      await notificationService.dismissAllNotifications();
      Alert.alert('Success', 'All notifications dismissed');
    } catch (error) {
      Alert.alert('Error', 'Failed to dismiss notifications');
      console.error(error);
    }
  };

  const copyToClipboard = (text: string) => {
    // In a real app, use Clipboard from expo-clipboard
    Alert.alert('Token', text);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.foreground }]}>
        Push Notification Testing
      </Text>

      {/* Device Info */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
          Device Info
        </Text>
        <Text style={[styles.infoText, { color: theme.mutedForeground }]}>
          Device: {Device.isDevice ? 'Physical Device' : 'Simulator'}
        </Text>
        <Text style={[styles.infoText, { color: theme.mutedForeground }]}>
          Platform: {Platform.OS}
        </Text>
        <Text style={[styles.infoText, { color: theme.mutedForeground }]}>
          OS Version: {Platform.Version}
        </Text>
      </View>

      {/* Push Token */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
          Expo Push Token
        </Text>
        {pushToken ? (
          <>
            <Text style={[styles.token, { color: theme.mutedForeground }]} numberOfLines={2}>
              {pushToken}
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => copyToClipboard(pushToken)}
            >
              <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
                Copy Token
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.infoText, { color: theme.mutedForeground }]}>
            {Device.isDevice ? 'Loading...' : 'Not available on simulator'}
          </Text>
        )}
      </View>

      {/* Custom Notification */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
          Schedule Custom Notification
        </Text>
        
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.foreground }]}
          placeholder="Title"
          placeholderTextColor={theme.mutedForeground}
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.foreground }]}
          placeholder="Body"
          placeholderTextColor={theme.mutedForeground}
          value={body}
          onChangeText={setBody}
          multiline
        />
        
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.foreground }]}
          placeholder="Delay (seconds)"
          placeholderTextColor={theme.mutedForeground}
          value={delaySeconds}
          onChangeText={setDelaySeconds}
          keyboardType="numeric"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.flexButton, { backgroundColor: theme.primary }]}
            onPress={handleScheduleNotification}
          >
            <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
              Schedule
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.flexButton, { backgroundColor: theme.destructive }]}
            onPress={handleCancelNotification}
            disabled={!notificationId}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>
              Cancel Last
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={handleCancelAll}
        >
          <Text style={[styles.buttonText, { color: theme.secondaryForeground }]}>
            Cancel All Scheduled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Deep Link Tests */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
          Test Deep Links
        </Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => handleScheduleWithDeepLink('notifications', '123')}
        >
          <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
            → Notification Detail
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => handleScheduleWithDeepLink('details', '456')}
        >
          <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
            → Home Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => handleScheduleWithDeepLink('profile')}
        >
          <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
            → Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Badge Management */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
          Badge Count: {badgeCount}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.flexButton, { backgroundColor: theme.primary }]}
            onPress={handleIncrementBadge}
          >
            <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
              +1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.flexButton, { backgroundColor: theme.secondary }]}
            onPress={handleClearBadge}
          >
            <Text style={[styles.buttonText, { color: theme.secondaryForeground }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dismiss */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={handleDismissAll}
        >
          <Text style={[styles.buttonText, { color: theme.secondaryForeground }]}>
            Dismiss All Notifications
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  token: {
    fontSize: 12,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  flexButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
