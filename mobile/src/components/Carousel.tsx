import React, { useRef, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, ViewToken } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  data, 
  renderItem,
  height = 200,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true 
}) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Auto-play logic
  React.useEffect(() => {
    if (!autoPlay || data.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, currentIndex, data.length, autoPlayInterval]);

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View style={[styles.slide, { width: screenWidth }]}>
            {renderItem(item, index)}
          </View>
        )}
      />

      {showIndicators && data.length > 1 && (
        <View style={styles.indicators}>
          {data.map((_, idx) => (
            <View 
              key={idx} 
              style={[
                styles.indicator,
                { backgroundColor: idx === currentIndex ? theme.primary : theme.muted }
              ]} 
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  slide: { justifyContent: 'center', alignItems: 'center' },
  indicators: { 
    position: 'absolute', 
    bottom: 16, 
    left: 0, 
    right: 0, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 6 
  },
  indicator: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
});
