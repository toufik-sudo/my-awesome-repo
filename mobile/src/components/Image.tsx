import React from 'react';
import {
  Image as RNImage,
  View,
  StyleSheet,
  ViewStyle,
  ImageProps as RNImageProps,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ImageProps extends Omit<RNImageProps, 'source'> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  rounded?: boolean;
  containerStyle?: ViewStyle;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  resizeMode = 'cover',
  rounded = false,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          aspectRatio,
          borderRadius: rounded ? 12 : 0,
          backgroundColor: theme.muted,
        },
        containerStyle,
      ]}
    >
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.primary} />
        </View>
      )}
      {!error && (
        <RNImage
          source={{ uri: src }}
          resizeMode={resizeMode}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          style={[
            styles.image,
            {
              width: '100%',
              height: '100%',
              borderRadius: rounded ? 12 : 0,
            },
            style,
          ]}
          accessibilityLabel={alt}
          {...props}
        />
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.mutedForeground, fontSize: 40 }}>🖼️</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorImage: {
    width: '50%',
    height: '50%',
    opacity: 0.3,
  },
});
