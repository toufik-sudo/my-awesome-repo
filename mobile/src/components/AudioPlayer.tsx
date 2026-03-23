import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useTheme } from '@/contexts/ThemeContext';

interface AudioPlayerProps {
  uri: string;
  title?: string;
  artist?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, title, artist }) => {
  const { theme } = useTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const waveAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const loadAndPlay = async () => {
    if (sound) {
      await sound.playAsync();
      startWaveAnimation();
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      startWaveAnimation();
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      stopWaveAnimation();
    }
  };

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopWaveAnimation = () => {
    waveAnim.setValue(0);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      if (!status.isPlaying) stopWaveAnimation();
    }
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else loadAndPlay();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity onPress={togglePlay} style={[styles.playBtn, { backgroundColor: theme.primary }]}>
        <Text style={{ fontSize: 20, color: theme.primaryForeground }}>{isPlaying ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        {title && <Text style={[styles.title, { color: theme.foreground }]} numberOfLines={1}>{title}</Text>}
        {artist && <Text style={[styles.artist, { color: theme.mutedForeground }]} numberOfLines={1}>{artist}</Text>}
        
        <View style={styles.progressRow}>
          <View style={[styles.progressBar, { backgroundColor: theme.muted }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.time, { color: theme.mutedForeground }]}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

      {isPlaying && (
        <View style={styles.waveform}>
          {[0, 1, 2].map(i => (
            <Animated.View
              key={i}
              style={[
                styles.wave,
                { 
                  backgroundColor: theme.primary,
                  transform: [{
                    scaleY: waveAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    })
                  }]
                }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 12 },
  playBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: '600' },
  artist: { fontSize: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  progressBar: { flex: 1, height: 3, borderRadius: 1.5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 1.5 },
  time: { fontSize: 10 },
  waveform: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  wave: { width: 3, height: 20, borderRadius: 1.5 },
});
