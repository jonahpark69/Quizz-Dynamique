# Quizz-Dynamique

Application de quiz dynamique construite avec Vue 3 + Vite, orientée expérience utilisateur fluide et migration propre d'une base legacy (UI/SCSS/assets) vers une architecture moderne par composants.

## Stack

- Vue 3
- Vite
- Vue Router
- Sass (SCSS)

## Features

- Quiz multi-thèmes avec progression question par question.
- Gestion des réponses, score courant et meilleur score.
- Écrans Intro / Question / Résultat.
- Mode clair/sombre.
- Animations UI (ripple, stagger, transitions de contenu).
- Compatibilité assets legacy (`/public/legacy/images`, `/public/legacy/audio`).

## Installation

```bash
npm install
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```

## Structure du projet

```text
src/
  views/         # pages (ex: QuizView)
  components/    # composants UI (header, card, answers, controls, result)
  composables/   # logique réutilisable (quiz, thème)
  styles/        # styles globaux + legacy SCSS
  utils/         # helpers (storage, timer, utilitaires)
public/
  legacy/        # images/audio legacy servis statiquement
```

## Roadmap (courte)

- Ajouter des tests unitaires sur composables (`useQuiz`, `useTheme`).
- Ajouter des tests E2E sur le flow complet du quiz.
- Finaliser l’outillage release/CI (lint + build + checks automatiques).
