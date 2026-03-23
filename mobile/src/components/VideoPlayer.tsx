import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useTheme } from '@/contexts/ThemeContext';

interface VideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  uri, 
  autoPlay = false,
  loop = false,
  showControls = true 
}) => {
  const { theme } = useTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    
    // Fade controls
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isLooping={loop}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      {showControls && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={togglePlay}
        >
          <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
            <View style={[styles.playBtn, { backgroundColor: theme.background + 'CC' }]}>
              <Text style={{ fontSize: 32, color: theme.foreground }}>
                {isPlaying ? '⏸' : '▶️'}
              </Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
            <View style={[styles.progressBar, { backgroundColor: theme.muted }]}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
            </View>
            <Text style={[styles.time, { color: theme.foreground }]}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' },
  video: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  controls: { position: 'absolute' },
  playBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  progressContainer: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  time: { fontSize: 11, marginTop: 4, textAlign: 'right' },
});
