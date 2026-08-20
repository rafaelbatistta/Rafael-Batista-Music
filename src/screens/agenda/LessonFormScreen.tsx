import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { StudentPickerModal } from '../../components/StudentPickerModal';
import { colors, spacing, typography } from '../../theme/theme';
import { getStudent } from '../../db/students';
import { createLesson, deleteLesson, getLesson, updateLesson } from '../../db/lessons';
import { Student } from '../../types';
import { AgendaStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AgendaStackParamList, 'LessonForm'>;

export function LessonFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const lessonId: number | undefined = route.params?.lessonId;
  const initialStudentId: number | undefined = route.params?.studentId;

  const [student, setStudent] = useState<Student | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (lessonId) {
        const lesson = await getLesson(lessonId);
        if (lesson) {
          setDate(new Date(lesson.date));
          setDuration(String(lesson.durationMinutes));
          setNotes(lesson.notes ?? '');
          const s = await getStudent(lesson.studentId);
          setStudent(s);
        }
      } else if (initialStudentId) {
        const s = await getStudent(initialStudentId);
        setStudent(s);
      }
    })();
  }, [lessonId, initialStudentId]);

  const handleSave = async () => {
    if (!student) return;
    setSaving(true);
    try {
      const input = {
        studentId: student.id,
        date: date.toISOString(),
        durationMinutes: Number(duration) || 60,
        notes: notes || null,
      };
      if (lessonId) {
        await updateLesson(lessonId, input);
      } else {
        await createLesson(input);
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lessonId) return;
    await deleteLesson(lessonId);
    navigation.goBack();
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={styles.title}>{lessonId ? 'Editar aula' : 'Nova aula'}</Text>

        <Text style={styles.label}>Aluno *</Text>
        <Button
          label={student ? student.name : 'Selecionar aluno'}
          variant="secondary"
          onPress={() => setPickerVisible(true)}
          style={styles.selectorButton}
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Data</Text>
            <Button
              label={date.toLocaleDateString('pt-BR')}
              variant="secondary"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Hora</Text>
            <Button
              label={date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              variant="secondary"
              onPress={() => setShowTimePicker(true)}
            />
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, selected) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selected) {
                const next = new Date(date);
                next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
                setDate(next);
              }
              if (Platform.OS === 'android') setShowDatePicker(false);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={(_, selected) => {
              setShowTimePicker(false);
              if (selected) {
                const next = new Date(date);
                next.setHours(selected.getHours(), selected.getMinutes());
                setDate(next);
              }
            }}
          />
        )}

        <FormField
          label="Duração (minutos)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <FormField
          label="Observações"
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Plano da aula, materiais, etc."
        />

        <Button label="Salvar" onPress={handleSave} disabled={!student} loading={saving} />
        {lessonId ? (
          <Button label="Excluir aula" variant="danger" onPress={handleDelete} style={{ marginTop: spacing.sm }} />
        ) : null}
      </ScrollView>

      <StudentPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={setStudent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  selectorButton: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowItem: {
    flex: 1,
    marginBottom: spacing.md,
  },
});
