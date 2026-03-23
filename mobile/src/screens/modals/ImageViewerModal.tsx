import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageViewerModal'>;

const { width, height } = Dimensions.get('window');

export default function ImageViewerModal({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { imageUrl } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Button 
            onPress={() => navigation.goBack()} 
            variant="ghost"
            size="sm"
          >
            Close
          </Button>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    alignItems: 'flex-end',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.8,
  },
});
