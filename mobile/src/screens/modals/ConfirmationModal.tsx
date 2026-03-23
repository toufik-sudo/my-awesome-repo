import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmationModal'>;

export default function ConfirmationModal({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { title, message, onConfirm } = route.params;

  const handleConfirm = () => {
    onConfirm();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.backdrop, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
      
      <View style={styles.modalContainer}>
        <Card style={[styles.modal, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.mutedForeground }]}>
            {message}
          </Text>
          
          <View style={styles.actions}>
            <Button 
              onPress={() => navigation.goBack()} 
              variant="outline"
              style={styles.button}
            >
              Cancel
            </Button>
            <Button 
              onPress={handleConfirm}
              variant="destructive"
              style={styles.button}
            >
              Confirm
            </Button>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
  },
  modal: {
    padding: spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
