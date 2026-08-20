import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Fab } from '../../components/Fab';
import { FormField } from '../../components/FormField';
import { colors, spacing, typography } from '../../theme/theme';
import { listStudents } from '../../db/students';
import { Student } from '../../types';
import { AlunosStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AlunosStackParamList, 'StudentsList'>;

export function StudentsListScreen() {
  const navigation = useNavigation<Nav>();
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      listStudents().then(setStudents);
    }, [])
  );

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.header}>Alunos</Text>
      <FormField label="" value={query} onChangeText={setQuery} placeholder="Buscar aluno" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum aluno cadastrado"
            subtitle="Toque no + para adicionar seu primeiro aluno."
          />
        }
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.instrument}>{item.instrument}</Text>
          </Card>
        )}
      />
      <Fab onPress={() => navigation.navigate('StudentForm', undefined)} />
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
  name: {
    ...typography.subtitle,
    color: colors.text,
  },
  instrument: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
});
