import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, Modal, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  itemsPerRow?: number;
  spacing?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  itemsPerRow = 3,
  spacing = 4 
}) => {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const imageSize = (screenWidth - (spacing * (itemsPerRow + 1))) / itemsPerRow;

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }, 100);
  };

  return (
    <>
      <View style={styles.grid}>
        {images.map((uri, idx) => (
          <TouchableOpacity 
            key={idx} 
            onPress={() => openModal(idx)}
            style={[styles.gridItem, { width: imageSize, height: imageSize, margin: spacing / 2 }]}
          >
            <Image source={{ uri }} style={styles.gridImage} />
          </TouchableOpacity>
        ))}
      </View>

      <Modal 
        visible={selectedIndex !== null} 
        transparent 
        animationType="fade"
        onRequestClose={() => setSelectedIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.closeBtn}
            onPress={() => setSelectedIndex(null)}
          >
            <View style={[styles.closeIcon, { backgroundColor: theme.background + 'CC' }]}>
              <View style={[styles.closeLine, { backgroundColor: theme.foreground }]} />
              <View style={[styles.closeLine, styles.closeLine2, { backgroundColor: theme.foreground }]} />
            </View>
          </TouchableOpacity>

          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            initialScrollIndex={selectedIndex || 0}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={[styles.fullImageContainer, { width: screenWidth }]}>
                <Image source={{ uri: item }} style={styles.fullImage} resizeMode="contain" />
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', margin: -2 },
  gridItem: { borderRadius: 8, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  closeBtn: { position: 'absolute', top: 48, right: 16, zIndex: 10 },
  closeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  closeLine: { position: 'absolute', width: 20, height: 2, borderRadius: 1, transform: [{ rotate: '45deg' }] },
  closeLine2: { transform: [{ rotate: '-45deg' }] },
  fullImageContainer: { justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: '100%', height: '100%' },
});
