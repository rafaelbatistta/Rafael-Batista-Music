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
import { listCourses } from '../../db/courses';
import { Course } from '../../types';
import { CursosStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<CursosStackParamList, 'CoursesList'>;

const statusMeta: Record<string, { label: string; tone: 'muted' | 'warning' | 'success' }> = {
  a_fazer: { label: 'A fazer', tone: 'muted' },
  em_andamento: { label: 'Em andamento', tone: 'warning' },
  concluido: { label: 'Concluído', tone: 'success' },
};

export function CoursesListScreen() {
  const navigation = useNavigation<Nav>();
  const [courses, setCourses] = useState<Course[]>([]);

  useFocusEffect(
    useCallback(() => {
      listCourses().then(setCourses);
    }, [])
  );

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.header}>Estante de Cursos</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            icon="📚"
            title="Nenhum curso ou material cadastrado"
            subtitle="Toque no + para adicionar cursos, métodos ou materiais de estudo."
          />
        }
        renderItem={({ item }) => {
          const status = statusMeta[item.status];
          return (
            <Card
              style={styles.card}
              onPress={() => navigation.navigate('CourseForm', { courseId: item.id })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.title}>{item.title}</Text>
                <Badge label={status.label} tone={status.tone} />
              </View>
              {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
            </Card>
          );
        }}
      />
      <Fab onPress={() => navigation.navigate('CourseForm', undefined)} />
    </ScreenContainer>
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
  card: {
    marginBottom: spacing.sm + 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  category: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
});
