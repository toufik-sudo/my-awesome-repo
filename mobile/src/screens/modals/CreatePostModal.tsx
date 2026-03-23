import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePostModal'>;

export default function CreatePostModal({ navigation }: Props) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log('Creating post:', { title, content });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          Create Post
        </Text>
        
        <Card style={styles.form}>
          <Input
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          
          <Input
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            style={[styles.input, styles.textarea]}
          />
          
          <View style={styles.actions}>
            <Button 
              onPress={() => navigation.goBack()} 
              variant="outline"
              style={styles.button}
            >
              Cancel
            </Button>
            <Button 
              onPress={handleSubmit}
              style={styles.button}
            >
              Post
            </Button>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: spacing.md,
  },
  textarea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
