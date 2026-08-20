import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { Fab } from '../../components/Fab';
import { colors, spacing, typography } from '../../theme/theme';
import { listPastLessons, listUpcomingLessons } from '../../db/lessons';
import { LessonWithStudent } from '../../types';
import { formatLessonDate } from '../../utils/date';
import { AgendaStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AgendaStackParamList, 'AgendaList'>;

const statusLabel: Record<string, { label: string; tone: 'primary' | 'success' | 'danger' }> = {
  scheduled: { label: 'Agendada', tone: 'primary' },
  done: { label: 'Dada', tone: 'success' },
  canceled: { label: 'Cancelada', tone: 'danger' },
};

export function AgendaListScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'proximas' | 'historico'>('proximas');
  const [lessons, setLessons] = useState<LessonWithStudent[]>([]);

  const load = useCallback(async () => {
    const nowIso = new Date().toISOString();
    const data =
      tab === 'proximas'
        ? await listUpcomingLessons(nowIso)
        : await listPastLessons(nowIso);
    setLessons(data);
  }, [tab]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.header}>Agenda</Text>
      <View style={styles.tabs}>
        <Tab label="Próximas" active={tab === 'proximas'} onPress={() => setTab('proximas')} />
        <Tab label="Histórico" active={tab === 'historico'} onPress={() => setTab('historico')} />
      </View>
      <FlatList
        data={lessons}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            title={tab === 'proximas' ? 'Nenhuma aula agendada' : 'Sem histórico ainda'}
            subtitle={
              tab === 'proximas'
                ? 'Toque no + para agendar uma nova aula.'
                : 'Aulas dadas ou canceladas aparecem aqui.'
            }
          />
        }
        renderItem={({ item }) => {
          const status = statusLabel[item.status];
          return (
            <Card
              style={styles.card}
              onPress={() => navigation.navigate('LessonDetail', { lessonId: item.id })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.studentName}>{item.studentName}</Text>
                <Badge label={status.label} tone={status.tone} />
              </View>
              <Text style={styles.instrument}>{item.studentInstrument}</Text>
              <Text style={styles.date}>{formatLessonDate(item.date)}</Text>
            </Card>
          );
        }}
      />
      <Fab onPress={() => navigation.navigate('LessonForm', undefined)} />
    </ScreenContainer>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text
      onPress={onPress}
      style={[styles.tabLabel, active && styles.tabLabelActive]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  header: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.lg,
  },
  tabLabel: {
    ...typography.subtitle,
    color: colors.textMuted,
    paddingBottom: spacing.xs,
  },
  tabLabelActive: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  card: {
    marginBottom: spacing.sm + 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    ...typography.subtitle,
    color: colors.text,
  },
  instrument: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  date: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
