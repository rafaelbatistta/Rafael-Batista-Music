import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { ShareCard } from '../../components/ShareCard';
import { colors, spacing, typography } from '../../theme/theme';
import { cancelLesson, getLesson, markLessonDone } from '../../db/lessons';
import { LessonWithStudent } from '../../types';
import { formatLessonDate } from '../../utils/date';
import { shareViewAsImage } from '../../utils/share';
import { AgendaStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AgendaStackParamList, 'LessonDetail'>;

const statusLabel: Record<string, { label: string; tone: 'primary' | 'success' | 'danger' }> = {
  scheduled: { label: 'Agendada', tone: 'primary' },
  done: { label: 'Dada', tone: 'success' },
  canceled: { label: 'Cancelada', tone: 'danger' },
};

export function LessonDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const lessonId: number = route.params.lessonId;

  const [lesson, setLesson] = useState<LessonWithStudent | null>(null);
  const [content, setContent] = useState('');
  const [wrapUpNotes, setWrapUpNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef<View>(null);

  const load = useCallback(async () => {
    const data = await getLesson(lessonId);
    setLesson(data);
    if (data) {
      setContent(data.content ?? '');
      setWrapUpNotes(data.notes ?? '');
    }
  }, [lessonId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!lesson) return <ScreenContainer />;

  const status = statusLabel[lesson.status];

  const handleMarkDone = async () => {
    setSaving(true);
    try {
      await markLessonDone(lesson.id, content || null, wrapUpNotes || null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    await cancelLesson(lesson.id);
    await load();
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareViewAsImage(shareRef, 'Compartilhar aula');
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScreenContainer style={{ padding: spacing.md }}>
      <ScrollView>
        <Card>
          <View style={styles.top}>
            <Text style={styles.studentName}>{lesson.studentName}</Text>
            <Badge label={status.label} tone={status.tone} />
          </View>
          <Text style={styles.instrument}>{lesson.studentInstrument}</Text>
          <Text style={styles.date}>{formatLessonDate(lesson.date)}</Text>
          <Text style={styles.duration}>{lesson.durationMinutes} minutos</Text>
        </Card>

        {lesson.status === 'scheduled' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={styles.sectionTitle}>Registrar aula dada</Text>
            <FormField
              label="Conteúdo trabalhado"
              value={content}
              onChangeText={setContent}
              multiline
              placeholder="Escalas, repertório, técnica..."
            />
            <FormField
              label="Observações"
              value={wrapUpNotes}
              onChangeText={setWrapUpNotes}
              multiline
              placeholder="Progresso do aluno, próximos passos..."
            />
            <Button label="Marcar como dada" onPress={handleMarkDone} loading={saving} />
            <Button
              label="Cancelar aula"
              variant="secondary"
              onPress={handleCancel}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}

        {lesson.status === 'done' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={styles.sectionTitle}>Conteúdo trabalhado</Text>
            <Text style={styles.bodyText}>{lesson.content || 'Nenhum registro.'}</Text>
            {lesson.notes ? (
              <>
                <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>Observações</Text>
                <Text style={styles.bodyText}>{lesson.notes}</Text>
              </>
            ) : null}
            <Button
              label="Compartilhar"
              variant="secondary"
              onPress={handleShare}
              loading={sharing}
              style={{ marginTop: spacing.md }}
            />
          </Card>
        )}

        {lesson.status === 'scheduled' && (
          <Button
            label="Editar"
            variant="ghost"
            onPress={() => navigation.navigate('LessonForm', { lessonId: lesson.id })}
            style={{ marginTop: spacing.md }}
          />
        )}
      </ScrollView>

      <View style={styles.offscreen} pointerEvents="none">
        <ShareCard
          ref={shareRef}
          studentName={lesson.studentName}
          instrument={lesson.studentInstrument}
          dateLabel={formatLessonDate(lesson.date)}
          content={lesson.content}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    ...typography.title,
    color: colors.text,
  },
  instrument: {
    ...typography.subtitle,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  date: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  duration: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bodyText: {
    ...typography.body,
    color: colors.text,
  },
  offscreen: {
    position: 'absolute',
    top: -100000,
    left: 0,
  },
});
