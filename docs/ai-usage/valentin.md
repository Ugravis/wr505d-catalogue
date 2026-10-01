# Journal d'utilisation de l'IA — Valentin

| Date | Modèle IA | Prompt | Questions répondues | Remarques |
|---|---|---|---|---|
| 2026-10-01 11:13 | Claude Sonnet 5.5 (Claude Code) | Fiche produit (/produits/[id]) • Galerie d'images, description, marque, note, stock, informations de garantie et de livraison. • Stock : « Plus que X en stock » en dessous de 5, bouton désactivé et « Rupture de stock » à 0. • SEO : useSeoMeta (titre, description, Open Graph avec image). Un identifiant inexistant renvoie une vraie 404 (createError), pas une page vide. N'oublie pas SOLID et le ai-usage. | Aucune question posée par l'agent. | Page `/produits/[id]` + BFF `/api/products/[id]` (404 propagée) + `useProduct`, `ProductGallery`, `ProductStock`, helpers `shared/stock` et `shared/errors`, tests unitaires. |
