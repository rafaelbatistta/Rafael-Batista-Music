import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { colors } from '../theme/theme';
import {
  AgendaStackParamList,
  AlunosStackParamList,
  CursosStackParamList,
  PerfilStackParamList,
  RootTabParamList,
} from './types';

import { AgendaListScreen } from '../screens/agenda/AgendaListScreen';
import { LessonFormScreen } from '../screens/agenda/LessonFormScreen';
import { LessonDetailScreen } from '../screens/agenda/LessonDetailScreen';

import { StudentsListScreen } from '../screens/alunos/StudentsListScreen';
import { StudentFormScreen } from '../screens/alunos/StudentFormScreen';
import { StudentDetailScreen } from '../screens/alunos/StudentDetailScreen';

import { CoursesListScreen } from '../screens/cursos/CoursesListScreen';
import { CourseFormScreen } from '../screens/cursos/CourseFormScreen';

import { PerfilScreen } from '../screens/perfil/PerfilScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const AgendaStack = createNativeStackNavigator<AgendaStackParamList>();
const AlunosStack = createNativeStackNavigator<AlunosStackParamList>();
const CursosStack = createNativeStackNavigator<CursosStackParamList>();
const PerfilStack = createNativeStackNavigator<PerfilStackParamList>();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

function AgendaNavigator() {
  return (
    <AgendaStack.Navigator screenOptions={stackScreenOptions}>
      <AgendaStack.Screen name="AgendaList" component={AgendaListScreen} options={{ headerShown: false }} />
      <AgendaStack.Screen name="LessonForm" component={LessonFormScreen} options={{ title: 'Aula' }} />
      <AgendaStack.Screen name="LessonDetail" component={LessonDetailScreen} options={{ title: 'Detalhes da aula' }} />
    </AgendaStack.Navigator>
  );
}

function AlunosNavigator() {
  return (
    <AlunosStack.Navigator screenOptions={stackScreenOptions}>
      <AlunosStack.Screen name="StudentsList" component={StudentsListScreen} options={{ headerShown: false }} />
      <AlunosStack.Screen name="StudentForm" component={StudentFormScreen} options={{ title: 'Aluno' }} />
      <AlunosStack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ title: 'Aluno' }} />
    </AlunosStack.Navigator>
  );
}

function CursosNavigator() {
  return (
    <CursosStack.Navigator screenOptions={stackScreenOptions}>
      <CursosStack.Screen name="CoursesList" component={CoursesListScreen} options={{ headerShown: false }} />
      <CursosStack.Screen name="CourseForm" component={CourseFormScreen} options={{ title: 'Curso' }} />
    </CursosStack.Navigator>
  );
}

function PerfilNavigator() {
  return (
    <PerfilStack.Navigator screenOptions={stackScreenOptions}>
      <PerfilStack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }} />
    </PerfilStack.Navigator>
  );
}

const tabIcons: Record<keyof RootTabParamList, string> = {
  AgendaTab: '📅',
  AlunosTab: '🎓',
  CursosTab: '📚',
  PerfilTab: '👤',
};

const tabLabels: Record<keyof RootTabParamList, string> = {
  AgendaTab: 'Agenda',
  AlunosTab: 'Alunos',
  CursosTab: 'Cursos',
  PerfilTab: 'Perfil',
};

export function RootNavigator() {
  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>{tabIcons[route.name as keyof RootTabParamList]}</Text>
          ),
          tabBarLabel: tabLabels[route.name as keyof RootTabParamList],
        })}
      >
        <Tab.Screen name="AgendaTab" component={AgendaNavigator} />
        <Tab.Screen name="AlunosTab" component={AlunosNavigator} />
        <Tab.Screen name="CursosTab" component={CursosNavigator} />
        <Tab.Screen name="PerfilTab" component={PerfilNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
