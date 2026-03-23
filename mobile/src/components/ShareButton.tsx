import React from 'react';
import { TouchableOpacity, Text, Share, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ShareButtonProps {
  title?: string;
  message: string;
  url?: string;
  label?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, message, url, label = '↗ Share' }) => {
  const { theme } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({ title, message: url ? `${message}\n${url}` : message, url });
    } catch {}
  };

  return (
    <TouchableOpacity onPress={handleShare} style={[styles.btn, { borderColor: theme.border }]}>
      <Text style={[styles.text, { color: theme.foreground }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  text: { fontSize: 13, fontWeight: '500' },
});
