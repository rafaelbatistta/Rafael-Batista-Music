import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'teacher_profile_v1';

export interface TeacherProfile {
  name: string;
  phone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  bio: string;
}

export const defaultProfile: TeacherProfile = {
  name: 'Rafael Batista',
  phone: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  youtube: '',
  bio: 'Aulas de música',
};

export async function loadProfile(): Promise<TeacherProfile> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProfile;
  try {
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export async function saveProfile(profile: TeacherProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
