import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme/theme';
import { createStudent, getStudent, updateStudent } from '../../db/students';
import { AlunosStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AlunosStackParamList, 'StudentForm'>;

export function StudentFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const studentId: number | undefined = route.params?.studentId;

  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [weekday, setWeekday] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (studentId) {
      getStudent(studentId).then((s) => {
        if (!s) return;
        setName(s.name);
        setInstrument(s.instrument);
        setPhone(s.phone ?? '');
        setEmail(s.email ?? '');
        setMonthlyFee(s.monthlyFee != null ? String(s.monthlyFee) : '');
        setWeekday(s.weekday ?? '');
        setTime(s.time ?? '');
        setNotes(s.notes ?? '');
      });
    }
  }, [studentId]);

  const handleSave = async () => {
    if (!name.trim() || !instrument.trim()) return;
    setSaving(true);
    try {
      const input = {
        name: name.trim(),
        instrument: instrument.trim(),
        phone: phone || null,
        email: email || null,
        monthlyFee: monthlyFee ? Number(monthlyFee) : null,
        weekday: weekday || null,
        time: time || null,
        notes: notes || null,
      };
      if (studentId) {
        await updateStudent(studentId, input);
      } else {
        await createStudent(input);
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer style={{ padding: spacing.md }}>
      <ScrollView>
        <Text style={styles.title}>{studentId ? 'Editar aluno' : 'Novo aluno'}</Text>
        <FormField label="Nome" value={name} onChangeText={setName} required placeholder="Nome do aluno" />
        <FormField
          label="Instrumento"
          value={instrument}
          onChangeText={setInstrument}
          required
          placeholder="Violão, piano, canto..."
        />
        <FormField label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <FormField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <FormField
          label="Mensalidade (R$)"
          value={monthlyFee}
          onChangeText={setMonthlyFee}
          keyboardType="numeric"
        />
        <FormField label="Dia fixo da semana" value={weekday} onChangeText={setWeekday} placeholder="Ex: Terça-feira" />
        <FormField label="Horário fixo" value={time} onChangeText={setTime} placeholder="Ex: 18:00" />
        <FormField label="Observações" value={notes} onChangeText={setNotes} multiline />
        <Button
          label="Salvar"
          onPress={handleSave}
          loading={saving}
          disabled={!name.trim() || !instrument.trim()}
        />
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
});
