import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

interface BadgeProps {
  label: string;
  tone?: 'primary' | 'success' | 'danger' | 'warning' | 'muted';
}

const toneColors: Record<NonNullable<BadgeProps['tone']>, string> = {
  primary: colors.primary,
  success: colors.success,
  danger: colors.danger,
  warning: colors.warning,
  muted: colors.textMuted,
};

export function Badge({ label, tone = 'muted' }: BadgeProps) {
  const tint = toneColors[tone];
  return (
    <View style={[styles.badge, { borderColor: tint, backgroundColor: `${tint}22` }]}>
      <Text style={[styles.text, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
