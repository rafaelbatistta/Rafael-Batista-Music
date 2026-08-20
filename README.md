# Registro de Aulas — Rafael Batista Music

App móvel (iOS e Android) para gerenciamento de aulas de música: agenda, cadastro de alunos, registro de aulas dadas, estante de cursos/materiais e compartilhamento nas redes sociais.

## Stack

- [Expo](https://expo.dev) + React Native + TypeScript
- React Navigation (bottom tabs + native stacks)
- SQLite local (`expo-sqlite`) — funciona 100% offline
- Compartilhamento nativo (`expo-sharing` + `react-native-view-shot`) para WhatsApp, Instagram, Facebook, TikTok e demais apps instalados

## Funcionalidades

- **Agenda**: aulas agendadas e histórico, marcar aula como dada com conteúdo trabalhado
- **Alunos**: cadastro, dados de contato, mensalidade, histórico de aulas por aluno
- **Estante de Cursos**: catálogo de cursos/materiais de estudo com status e link
- **Perfil**: dados do professor, redes sociais e compartilhamento de progresso/conteúdo

## Rodando o projeto

```bash
npm install
npm start        # abre o Metro/Expo Dev Tools
npm run android  # abre no emulador/dispositivo Android
npm run ios      # abre no simulador/dispositivo iOS (necessário macOS)
```

Use o app **Expo Go** no seu celular para testar rapidamente escaneando o QR code do `npm start`.
