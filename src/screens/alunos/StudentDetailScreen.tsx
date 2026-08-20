import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, typography } from '../../theme/theme';
import { getStudent, setStudentActive } from '../../db/students';
import { listLessonsByStudent } from '../../db/lessons';
import { Lesson, Student } from '../../types';
import { formatShortDate } from '../../utils/date';
import { shareText } from '../../utils/share';
import { AlunosStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AlunosStackParamList, 'StudentDetail'>;

const statusLabel: Record<string, { label: string; tone: 'primary' | 'success' | 'danger' }> = {
  scheduled: { label: 'Agendada', tone: 'primary' },
  done: { label: 'Dada', tone: 'success' },
  canceled: { label: 'Cancelada', tone: 'danger' },
};

export function StudentDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const studentId: number = route.params.studentId;

  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const load = useCallback(async () => {
    const s = await getStudent(studentId);
    setStudent(s);
    const l = await listLessonsByStudent(studentId);
    setLessons(l);
  }, [studentId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!student) return <ScreenContainer />;

  const doneCount = lessons.filter((l) => l.status === 'done').length;

  const handleSchedule = () => {
    (navigation.getParent() as any)?.navigate('AgendaTab', {
      screen: 'LessonForm',
      params: { studentId },
    });
  };

  const handleShareProgress = async () => {
    await shareText(
      `🎵 ${student.name} já teve ${doneCount} aula(s) de ${student.instrument} comigo!\nRafael Batista Music`
    );
  };

  const handleArchive = async () => {
    await setStudentActive(studentId, false);
    navigation.goBack();
  };

  return (
    <ScreenContainer style={{ padding: spacing.md }}>
      <Card>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.instrument}>{student.instrument}</Text>
        {student.weekday || student.time ? (
          <Text style={styles.meta}>
            {student.weekday ?? ''} {student.time ?? ''}
          </Text>
        ) : null}
        {student.phone ? <Text style={styles.meta}>📞 {student.phone}</Text> : null}
        {student.monthlyFee != null ? (
          <Text style={styles.meta}>💰 R$ {student.monthlyFee.toFixed(2)}/mês</Text>
        ) : null}
        {student.notes ? <Text style={styles.notes}>{student.notes}</Text> : null}

        <View style={styles.actionsRow}>
          <Button label="Agendar aula" onPress={handleSchedule} style={styles.actionButton} />
          <Button
            label="Editar"
            variant="secondary"
            onPress={() => navigation.navigate('StudentForm', { studentId })}
            style={styles.actionButton}
          />
        </View>
        <Button
          label="Compartilhar progresso"
          variant="secondary"
          onPress={handleShareProgress}
          style={{ marginTop: spacing.sm }}
        />
        <Button
          label="Arquivar aluno"
          variant="ghost"
          onPress={handleArchive}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      <Text style={styles.sectionHeader}>Histórico de aulas ({doneCount} dadas)</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<EmptyState title="Nenhuma aula registrada ainda" />}
        renderItem={({ item }) => {
          const status = statusLabel[item.status];
          return (
            <Card style={styles.lessonCard}>
              <View style={styles.lessonTop}>
                <Text style={styles.lessonDate}>{formatShortDate(item.date)}</Text>
                <Badge label={status.label} tone={status.tone} />
              </View>
              {item.content ? <Text style={styles.lessonContent}>{item.content}</Text> : null}
            </Card>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: {
    ...typography.title,
    color: colors.text,
  },
  instrument: {
    ...typography.subtitle,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  notes: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  sectionHeader: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  lessonCard: {
    marginBottom: spacing.sm,
  },
  lessonTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDate: {
    ...typography.body,
    color: colors.text,
  },
  lessonContent: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
