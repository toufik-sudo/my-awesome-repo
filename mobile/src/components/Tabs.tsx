import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing } from '@/constants/theme.constants';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'pills';
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'default',
  style,
}) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState(
    defaultValue || tabs[0]?.value || ''
  );

  const activeValue = controlledValue ?? internalValue;

  const handleChange = (value: string) => {
    setInternalValue(value);
    onChange?.(value);
  };

  const activeTab = tabs.find((tab) => tab.value === activeValue);

  const isPills = variant === 'pills';

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[
          styles.tabList,
          isPills && styles.pillsContainer,
          { borderBottomColor: theme.border },
        ]}
        contentContainerStyle={styles.tabListContent}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === activeValue;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tab,
                isPills && styles.pillTab,
                isPills && { backgroundColor: theme.muted },
                isActive && styles.activeTab,
                isActive &&
                  isPills && {
                    backgroundColor: theme.primary,
                  },
                !isPills &&
                  isActive && {
                    borderBottomColor: theme.primary,
                    borderBottomWidth: 2,
                  },
              ]}
              onPress={() => handleChange(tab.value)}
              activeOpacity={0.7}
            >
              {tab.icon && <View style={styles.icon}>{tab.icon}</View>}
              <Text
                style={[
                  styles.tabText,
                  { color: theme.foreground },
                  isActive && isPills && { color: theme.primaryForeground },
                ]}
              >
                {tab.label}
              </Text>
              {tab.badge !== undefined && (
                <View
                  style={[styles.badge, { backgroundColor: theme.destructive }]}
                >
                  <Text style={[styles.badgeText, { color: theme.destructiveForeground }]}>
                    {tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.contentContainer}>
        {activeTab?.content || (
          <Text style={{ color: theme.mutedForeground }}>No content</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabList: {
    borderBottomWidth: 1,
  },
  pillsContainer: {
    borderBottomWidth: 0,
    paddingVertical: spacing.xs,
  },
  tabListContent: {
    paddingHorizontal: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
  },
  pillTab: {
    borderRadius: 20,
  },
  activeTab: {},
  icon: {
    marginRight: spacing.xs,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
});
