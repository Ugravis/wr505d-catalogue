# Catalogue

Projet BUT3 (WR505D) : catalogue e-commerce développé avec Nuxt 3/Vue 3, consommant l'API [DummyJSON](https://dummyjson.com/) pour les produits et l'authentification. Fonctionnalités principales : recherche/filtres/tri de produits, fiche produit, panier avec persistance par cookie, moteur de promotions, authentification (connexion/compte).

## Stack technique

- [Nuxt 4](https://nuxt.com) / [Vue 3](https://vuejs.org) (`<script setup>`, TypeScript strict)
- [Pinia](https://pinia.vuejs.org) pour la gestion d'état (panier, authentification)
- [shadcn-vue](https://www.shadcn-vue.com) / [Tailwind CSS 4](https://tailwindcss.com) pour le design
- [Vitest](https://vitest.dev) (tests unitaires et Nuxt) et [Playwright](https://playwright.dev) (tests end-to-end)
- ESLint strict (`@typescript-eslint/no-explicit-any` en erreur — aucun `any` dans le code)

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application est servie sur `http://localhost:3000`.

## Build & prévisualisation

```bash
npm run build
npm run preview
```

## Qualité & tests

```bash
npm run lint          # ESLint
npm run typecheck     # vue-tsc
npm run test          # Vitest (unitaires + Nuxt)
npm run test:coverage # Vitest avec couverture
npm run test:e2e      # Playwright
npm run check-all     # lint + typecheck + test:coverage
```

## Conventions de contribution

- **Gitflow** : branches `main` et `develop` protégées (jamais de commit direct), développement sur des branches `feature/<n°>-<description>`.
- **Conventional Commits** pour les messages de commit (`feat`, `fix`, `docs`, `chore`, `test`, …).
- **Principes SOLID** pour l'architecture du code.
- Utilisation de milestones et labels GitHub pour le suivi.
- Les pull requests sont gérées par le mainteneur du projet.

## Traçabilité de l'usage de l'IA

Chaque prompt adressé à un outil d'IA générative dans le cadre de ce projet est consigné dans [`docs/ai-usage/`](docs/ai-usage/) (un fichier par contributeur), avec la date, le prompt, les réponses aux questions posées par l'agent, et un résumé du résultat.

## Dépôt

[github.com/Ugravis/wr505d-catalogue](https://github.com/Ugravis/wr505d-catalogue)
