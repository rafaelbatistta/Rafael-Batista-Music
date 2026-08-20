import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme/theme';
import { createCourse, deleteCourse, getCourse, updateCourse } from '../../db/courses';
import { CourseStatus } from '../../types';
import { shareText } from '../../utils/share';
import { CursosStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<CursosStackParamList, 'CourseForm'>;

const statusOptions: { value: CourseStatus; label: string }[] = [
  { value: 'a_fazer', label: 'A fazer' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido', label: 'Concluído' },
];

export function CourseFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const courseId: number | undefined = route.params?.courseId;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<CourseStatus>('a_fazer');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courseId) {
      getCourse(courseId).then((c) => {
        if (!c) return;
        setTitle(c.title);
        setCategory(c.category ?? '');
        setDescription(c.description ?? '');
        setLink(c.link ?? '');
        setStatus(c.status);
      });
    }
  }, [courseId]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const input = {
        title: title.trim(),
        category: category || null,
        description: description || null,
        link: link || null,
        status,
      };
      if (courseId) {
        await updateCourse(courseId, input);
      } else {
        await createCourse(input);
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;
    await deleteCourse(courseId);
    navigation.goBack();
  };

  const handleShare = async () => {
    const parts = [`📚 ${title}`];
    if (category) parts.push(category);
    if (link) parts.push(link);
    parts.push('Rafael Batista Music');
    await shareText(parts.join('\n'));
  };

  return (
    <ScreenContainer style={{ padding: spacing.md }}>
      <ScrollView>
        <Text style={styles.title}>{courseId ? 'Editar curso' : 'Novo curso/material'}</Text>
        <FormField label="Título" value={title} onChangeText={setTitle} required />
        <FormField label="Categoria/Instrumento" value={category} onChangeText={setCategory} />
        <FormField label="Descrição" value={description} onChangeText={setDescription} multiline />
        <FormField label="Link (opcional)" value={link} onChangeText={setLink} keyboardType="url" />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {statusOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setStatus(opt.value)}
              style={[styles.chip, status === opt.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, status === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button label="Salvar" onPress={handleSave} loading={saving} disabled={!title.trim()} style={{ marginTop: spacing.md }} />
        <Button label="Compartilhar" variant="secondary" onPress={handleShare} style={{ marginTop: spacing.sm }} />
        {courseId ? (
          <Button label="Excluir" variant="danger" onPress={handleDelete} style={{ marginTop: spacing.sm }} />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#170F2B',
  },
});
