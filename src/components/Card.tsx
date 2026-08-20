import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

interface CardProps extends ViewProps {
  onPress?: () => void;
}

export function Card({ style, children, onPress, ...rest }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
