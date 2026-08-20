import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { FormField } from './FormField';
import { listStudents } from '../db/students';
import { Student } from '../types';

interface StudentPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (student: Student) => void;
}

export function StudentPickerModal({ visible, onClose, onSelect }: StudentPickerModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) {
      listStudents().then(setStudents);
      setQuery('');
    }
  }, [visible]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Selecionar aluno</Text>
          <FormField
            label="Buscar"
            value={query}
            onChangeText={setQuery}
            placeholder="Nome do aluno"
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            style={{ maxHeight: 320 }}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum aluno cadastrado ainda.</Text>
            }
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowInstrument}>{item.instrument}</Text>
              </Pressable>
            )}
          />
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  rowInstrument: {
    ...typography.caption,
    color: colors.textMuted,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  closeText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
