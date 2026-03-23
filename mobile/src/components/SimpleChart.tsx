import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  showValues?: boolean;
  showGrid?: boolean;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  type = 'bar', 
  height = 200, 
  showValues = true,
  showGrid = true 
}) => {
  const { theme } = useTheme();
  
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartWidth = screenWidth - 80;
  const barWidth = Math.min(40, chartWidth / data.length - 12);

  if (type === 'pie') {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let accAngle = 0;

    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.pieContainer}>
          {data.map((item, idx) => {
            const percent = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const color = item.color || theme.primary;
            
            accAngle += angle;
            
            return (
              <View key={idx} style={styles.pieLegendItem}>
                <View style={[styles.pieDot, { backgroundColor: color }]} />
                <Text style={[styles.pieLegendText, { color: theme.foreground }]}>
                  {item.label}: {percent.toFixed(1)}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {showGrid && (
        <View style={styles.gridLines}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <View key={i} style={[styles.gridLine, { 
              bottom: ratio * (height - 40),
              borderColor: theme.border 
            }]} />
          ))}
        </View>
      )}
      
      <View style={styles.chartArea}>
        {data.map((item, idx) => {
          const barHeight = (item.value / maxValue) * (height - 60);
          const color = item.color || theme.primary;

          return (
            <View key={idx} style={styles.barContainer}>
              {showValues && (
                <Text style={[styles.valueLabel, { color: theme.foreground }]}>
                  {item.value}
                </Text>
              )}
              <View style={[styles.bar, { 
                height: barHeight, 
                width: barWidth,
                backgroundColor: color 
              }]} />
              <Text 
                style={[styles.label, { color: theme.mutedForeground }]} 
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gridLines: {
    position: 'absolute',
    left: 40,
    right: 16,
    top: 12,
    bottom: 32,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    opacity: 0.2,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    borderRadius: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  pieContainer: {
    padding: 16,
    gap: 8,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pieDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pieLegendText: {
    fontSize: 13,
  },
});
