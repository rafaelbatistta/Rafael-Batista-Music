import React, { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme/theme';
import { loadProfile, saveProfile, TeacherProfile } from '../../utils/profile';
import { shareText } from '../../utils/share';
import { facebookUrl, instagramUrl, tiktokUrl, whatsappUrl, youtubeUrl } from '../../utils/social';
import { listStudents } from '../../db/students';
import { listLessons } from '../../db/lessons';

export function PerfilScreen() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeStudents, setActiveStudents] = useState(0);
  const [lessonsThisMonth, setLessonsThisMonth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
      (async () => {
        const students = await listStudents();
        setActiveStudents(students.length);
        const lessons = await listLessons();
        const now = new Date();
        const count = lessons.filter((l) => {
          if (l.status !== 'done') return false;
          const d = new Date(l.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        setLessonsThisMonth(count);
      })();
    }, [])
  );

  if (!profile) return <ScreenContainer />;

  const update = (patch: Partial<TeacherProfile>) => setProfile({ ...profile, ...patch });

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile(profile);
    } finally {
      setSaving(false);
    }
  };

  const handleShareApp = async () => {
    await shareText(
      `🎵 ${profile.name} — ${profile.bio}\nAcompanhe minhas aulas de música!${
        profile.phone ? `\nWhatsApp: ${profile.phone}` : ''
      }`
    );
  };

  const socialLinks = [
    { key: 'whatsapp', label: 'WhatsApp', value: profile.phone, url: whatsappUrl(profile.phone) },
    { key: 'instagram', label: 'Instagram', value: profile.instagram, url: instagramUrl(profile.instagram) },
    { key: 'facebook', label: 'Facebook', value: profile.facebook, url: facebookUrl(profile.facebook) },
    { key: 'tiktok', label: 'TikTok', value: profile.tiktok, url: tiktokUrl(profile.tiktok) },
    { key: 'youtube', label: 'YouTube', value: profile.youtube, url: youtubeUrl(profile.youtube) },
  ].filter((s) => s.value.trim().length > 0);

  return (
    <ScreenContainer style={{ padding: spacing.md }}>
      <ScrollView>
        <Text style={styles.header}>Perfil</Text>

        <Card style={styles.statsCard}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{activeStudents}</Text>
            <Text style={styles.statLabel}>Alunos ativos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{lessonsThisMonth}</Text>
            <Text style={styles.statLabel}>Aulas este mês</Text>
          </View>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.sectionTitle}>Dados do professor</Text>
          <FormField label="Nome" value={profile.name} onChangeText={(v) => update({ name: v })} />
          <FormField label="Bio / especialidade" value={profile.bio} onChangeText={(v) => update({ bio: v })} />
          <FormField
            label="WhatsApp (com DDD)"
            value={profile.phone}
            onChangeText={(v) => update({ phone: v })}
            keyboardType="phone-pad"
          />
          <FormField
            label="Instagram (@usuario)"
            value={profile.instagram}
            onChangeText={(v) => update({ instagram: v })}
          />
          <FormField
            label="Facebook"
            value={profile.facebook}
            onChangeText={(v) => update({ facebook: v })}
          />
          <FormField
            label="TikTok (@usuario)"
            value={profile.tiktok}
            onChangeText={(v) => update({ tiktok: v })}
          />
          <FormField
            label="YouTube (@canal)"
            value={profile.youtube}
            onChangeText={(v) => update({ youtube: v })}
          />
          <Button label="Salvar perfil" onPress={handleSave} loading={saving} />
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.sectionTitle}>Minhas redes</Text>
          {socialLinks.length === 0 ? (
            <Text style={styles.mutedText}>
              Preencha seus contatos acima para ter acesso rápido às suas redes.
            </Text>
          ) : (
            <View style={styles.socialGrid}>
              {socialLinks.map((s) => (
                <Button
                  key={s.key}
                  label={s.label}
                  variant="secondary"
                  onPress={() => Linking.openURL(s.url)}
                  style={styles.socialButton}
                />
              ))}
            </View>
          )}
        </Card>

        <Button
          label="Compartilhar meu trabalho"
          onPress={handleShareApp}
          style={{ marginTop: spacing.md }}
        />
        <Text style={styles.footerNote}>
          O compartilhamento abre o menu nativo do seu celular, de onde você escolhe WhatsApp,
          Instagram, Facebook, TikTok ou outro app instalado.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gold,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  mutedText: {
    color: colors.textMuted,
    ...typography.body,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  socialButton: {
    flexGrow: 1,
  },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
