import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from './Button';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing } from '@/constants/theme.constants';

export interface BiometricAuthProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
  children?: React.ReactNode;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onError,
  onCancel,
  promptMessage = 'Authenticate to continue',
  cancelLabel = 'Cancel',
  fallbackLabel = 'Use Passcode',
  disableDeviceFallback = false,
  children,
}) => {
  const { theme } = useTheme();
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setIsAvailable(compatible && enrolled);
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Touch ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('Iris Scan');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = async () => {
    if (!isAvailable) {
      onError?.('Biometric authentication is not available on this device');
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel,
        fallbackLabel: disableDeviceFallback ? undefined : fallbackLabel,
        disableDeviceFallback,
      });

      if (result.success) {
        onSuccess();
      } else {
        if (result.error === 'user_cancel') {
          onCancel?.();
        } else {
          onError?.(result.error || 'Authentication failed');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication error';
      onError?.(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (children) {
    return <View onTouchEnd={authenticate}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {isAvailable ? (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              {biometricType === 'Face ID' ? '👤' : '👆'}
            </Text>
          </View>
          
          <Text style={[styles.title, { color: theme.foreground }]}>
            {biometricType} Authentication
          </Text>
          
          <Text style={[styles.message, { color: theme.mutedForeground }]}>
            {promptMessage}
          </Text>
          
          <Button
            onPress={authenticate}
            loading={isAuthenticating}
            style={styles.button}
          >
            Authenticate with {biometricType}
          </Button>
          
          {onCancel && (
            <Button
              onPress={onCancel}
              variant="ghost"
              disabled={isAuthenticating}
              style={styles.cancelButton}
            >
              {cancelLabel}
            </Button>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.foreground }]}>
            Biometric Not Available
          </Text>
          <Text style={[styles.message, { color: theme.mutedForeground }]}>
            {Platform.OS === 'ios'
              ? 'Face ID or Touch ID is not set up on this device'
              : 'Fingerprint or face authentication is not available'}
          </Text>
          {onCancel && (
            <Button onPress={onCancel} style={styles.button}>
              Continue Without Biometric
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
    marginBottom: spacing.md,
  },
  cancelButton: {
    width: '100%',
  },
});

// Utility functions for direct use
export const checkBiometricSupport = async (): Promise<{
  isAvailable: boolean;
  biometricType: string;
}> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    let biometricType = 'None';
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'Touch ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'Iris Scan';
    }
    
    return {
      isAvailable: compatible && enrolled,
      biometricType,
    };
  } catch (error) {
    return {
      isAvailable: false,
      biometricType: 'None',
    };
  }
};

export const authenticateAsync = async (
  options?: LocalAuthentication.LocalAuthenticationOptions
): Promise<LocalAuthentication.LocalAuthenticationResult> => {
  return await LocalAuthentication.authenticateAsync(options);
};
