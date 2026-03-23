import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
  visible?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  fullScreen = false,
  visible = true,
  style,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const content = (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={theme.primary} />
      {text && (
        <Text style={[styles.text, { color: theme.foreground }]}>{text}</Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View
          style={[
            styles.fullScreenContainer,
            { backgroundColor: 'rgba(0,0,0,0.5)' },
          ]}
        >
          <View
            style={[
              styles.fullScreenContent,
              { backgroundColor: theme.card },
            ]}
          >
            {content}
          </View>
        </View>
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContent: {
    padding: 32,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
  },
});
