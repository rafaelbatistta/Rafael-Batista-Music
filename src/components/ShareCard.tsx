import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

interface ShareCardProps {
  studentName: string;
  instrument: string;
  dateLabel: string;
  content?: string | null;
}

export const ShareCard = forwardRef<View, ShareCardProps>(
  ({ studentName, instrument, dateLabel, content }, ref) => {
    return (
      <View ref={ref} collapsable={false} style={styles.card}>
        <View style={styles.accentBar} />
        <Text style={styles.kicker}>🎵 AULA REGISTRADA</Text>
        <Text style={styles.student}>{studentName}</Text>
        <Text style={styles.instrument}>{instrument}</Text>
        <Text style={styles.date}>{dateLabel}</Text>
        {content ? (
          <View style={styles.contentBox}>
            <Text style={styles.contentLabel}>Conteúdo trabalhado</Text>
            <Text style={styles.contentText}>{content}</Text>
          </View>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Rafael Batista Music</Text>
        </View>
      </View>
    );
  }
);

const CARD_SIZE = 1080;

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: colors.background,
    padding: 72,
    justifyContent: 'center',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: colors.gold,
  },
  kicker: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 32,
  },
  student: {
    color: colors.text,
    fontSize: 72,
    fontWeight: '800',
  },
  instrument: {
    color: colors.primary,
    fontSize: 40,
    fontWeight: '600',
    marginTop: 12,
  },
  date: {
    color: colors.textMuted,
    fontSize: 32,
    marginTop: 24,
  },
  contentBox: {
    marginTop: 56,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 40,
    borderWidth: 2,
    borderColor: colors.border,
  },
  contentLabel: {
    color: colors.textMuted,
    fontSize: 26,
    marginBottom: spacing.sm,
  },
  contentText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 46,
  },
  footer: {
    position: 'absolute',
    bottom: 64,
    left: 72,
    right: 72,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 30,
    fontWeight: '700',
  },
});
