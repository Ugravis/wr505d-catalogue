# Journal d'utilisation de l'IA — Ulysse

## 2026-10-01 — Page produits (`/produits`)

- **Outil** : Claude Code (Claude Sonnet 5)
- **Prompt** :
  > Première page du site : produits/. Utilisation de Dummyjson pour les produits. En afficher 12 par page, avec système de pagination. Chaque produit : image, nom, prix, note. États à gérer : chargement (squelettes), aucun résultat, erreur réseau avec bouton « Réessayer ». Utilisation de Shadcn. Recherche plein texte avec debounce de 300 ms. Une réponse ancienne ne doit jamais écraser une réponse plus récente (frappe rapide). Si recherche, elle doit figurer dans les query params de la recherche (url comme source de vérité). Si tu as des questions n'hésite pas, sinon code.
- **Questions posées par l'agent et réponses** :
  1. Installer Tailwind CSS + shadcn-vue (le projet ne les avait pas encore) ? → Oui, installation complète.
  2. Approche de data fetching (composable `useFetch`/`useAsyncData` vs store Pinia dédié) ? → Composable réutilisable avec `useAsyncData`.
- **Résumé de la réponse / travail réalisé** :
  - Installation et configuration de Tailwind CSS v4 et shadcn-vue (`components.json`, thème CSS, composants `card`, `skeleton`, `button`, `input`, `pagination`, `alert`, `badge`).
  - Ajout des types DummyJSON dans `types/dummyjson.ts`.
  - Composable `app/composables/useProducts.ts` basé sur `useAsyncData` (dedupe "cancel" natif → une réponse obsolète ne peut pas écraser une réponse plus récente), avec une fonction pure `buildProductsRequest` testée unitairement.
  - Page `app/pages/produits/index.vue` : grille de `ProductCard` (image, titre, note, prix), squelettes de chargement (`ProductCardSkeleton`), état « aucun résultat », état d'erreur réseau avec bouton « Réessayer », pagination shadcn (12 produits/page), champ de recherche avec debounce 300 ms (`useDebounceFn` de VueUse) qui met à jour les query params (`q`, `page`) — l'URL reste la source de vérité, y compris pour la navigation arrière/avant.
  - Redirection `/` → `/produits` via `routeRules`.
  - Tests unitaires (`test/unit/useProducts.test.ts`) couvrant la pagination (12/page), le calcul de `skip`, le choix d'endpoint (liste vs recherche) et le trim de la requête.
  - Vérifications : `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` passent tous.
  - Limite constatée : dans cet environnement d'exécution sandboxé, les appels réseau sortants faits depuis le process `nuxt dev` lui-même sont interceptés/mockés (données aléatoires), alors que les mêmes appels via `curl`/`node` directs renvoient bien les vraies données DummyJSON. Le composable a donc été validé par tests unitaires + vérification manuelle de la requête réelle, mais pas par un test de navigateur en conditions réelles dans cette session.
