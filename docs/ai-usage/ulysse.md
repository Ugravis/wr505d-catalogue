# Journal d'utilisation de l'IA — Ulysse

| Date | Modèle IA | Prompt | Questions répondues | Remarques |
|---|---|---|---|---|
| 2026-10-01 | Claude Sonnet 5 (Claude Code) | Première page du site : produits/. Utilisation de Dummyjson pour les produits. En afficher 12 par page, avec système de pagination. Chaque produit : image, nom, prix, note. États à gérer : chargement (squelettes), aucun résultat, erreur réseau avec bouton « Réessayer ». Utilisation de Shadcn. Recherche plein texte avec debounce de 300 ms. Une réponse ancienne ne doit jamais écraser une réponse plus récente (frappe rapide). Si recherche, elle doit figurer dans les query params de la recherche (url comme source de vérité). Si tu as des questions n'hésite pas, sinon code. | Installer Tailwind + shadcn-vue ? → Oui. Approche data fetching ? → Composable `useAsyncData`. | Page `/produits` + composables/types + tests unitaires. |
