# Changelog

Toutes les évolutions notables de ce projet sont documentées dans ce fichier.

## [0.1.0] - 2026-10-12

### Ajouts

- Page catalogue `/produits` avec recherche plein texte (debounce), pagination et gestion des états (chargement, vide, erreur).
- Filtres (catégorie, prix min/max) et tri (prix, note, titre) via un BFF Nitro avec cache serveur.
- Page de fiche produit avec états de stock, SEO et vraie page 404.
- Affichage du nombre de stock pour tous les produits.
- Panier Pinia avec persistance par cookie, gestion de quantité limitée au stock, navbar avec badge.
- Panneau latéral du panier sur ordinateur, avec bascule vers la vue pleine page.
- Moteur de promotions pur avec tests d'acceptation, intégré au panier (badges, remise par ligne de produit, remise beauté dès 3 articles, code promo, seuil de livraison offerte).
- Authentification DummyJSON : routes BFF login/me/refresh/logout, store Pinia, pages connexion/compte, rafraîchissement de token en single-flight, middleware de protection de route.
- Navbar avec nom de la boutique, lien profil/connexion et bascule de thème sombre.
- Pied de page du site.
- Bannière de livraison offerte, repliable.
- Logo (pictogramme fleur) à côté du nom de la boutique.
- Mise en forme des filtres dans une carte, sur une seule ligne, avec barre de recherche étendue.

### Corrections

- Détection d'erreur dans le composable `useProducts`.
- Confirmation avant vidage du panier, libellé de quantité visible, affichage des erreurs de stock.
- Suppression du badge de pourcentage de remise sur les fiches produit.
- Persistance du code promo au rechargement, affichage du seuil de livraison offerte, conservation des filtres au retour vers le catalogue depuis une fiche produit.

### Divers

- Mise en place de Pinia, ESLint, Vitest, TypeScript strict.
- Mise en place de la CI GitHub Actions et du template de pull request.
- Script `check-all` (lint + typecheck + couverture de tests).
