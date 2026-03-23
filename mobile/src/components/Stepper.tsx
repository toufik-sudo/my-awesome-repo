import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface StepperProps {
  steps: string[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep,
  orientation = 'horizontal' 
}) => {
  const { theme } = useTheme();
  const isVertical = orientation === 'vertical';

  return (
    <View style={[styles.container, isVertical && styles.vertical]}>
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={idx}>
            <View style={[styles.stepContainer, isVertical && styles.stepVertical]}>
              <View style={styles.stepIndicator}>
                <View style={[
                  styles.circle,
                  { 
                    backgroundColor: isCompleted || isActive ? theme.primary : theme.muted,
                    borderColor: isActive ? theme.primary : theme.border,
                  }
                ]}>
                  {isCompleted ? (
                    <Text style={{ color: theme.primaryForeground, fontSize: 12, fontWeight: '700' }}>✓</Text>
                  ) : (
                    <Text style={[
                      styles.stepNumber,
                      { color: isActive ? theme.primaryForeground : theme.mutedForeground }
                    ]}>
                      {idx + 1}
                    </Text>
                  )}
                </View>
              </View>
              
              <Text style={[
                styles.stepLabel,
                { color: isActive ? theme.foreground : theme.mutedForeground },
                isActive && { fontWeight: '600' },
                isVertical && styles.stepLabelVertical,
              ]}>
                {step}
              </Text>
            </View>

            {!isLast && (
              <View style={[
                styles.connector,
                isVertical ? styles.connectorVertical : styles.connectorHorizontal,
                { backgroundColor: isCompleted ? theme.primary : theme.border }
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  vertical: { flexDirection: 'column', alignItems: 'flex-start' },
  stepContainer: { alignItems: 'center', gap: 6 },
  stepVertical: { flexDirection: 'row', gap: 12 },
  stepIndicator: { position: 'relative' },
  circle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    borderWidth: 2,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  stepNumber: { fontSize: 13, fontWeight: '600' },
  stepLabel: { fontSize: 12, textAlign: 'center' },
  stepLabelVertical: { textAlign: 'left', flex: 1 },
  connector: {},
  connectorHorizontal: { flex: 1, height: 2, marginHorizontal: -8 },
  connectorVertical: { width: 2, height: 32, marginLeft: 15, marginVertical: -4 },
});
