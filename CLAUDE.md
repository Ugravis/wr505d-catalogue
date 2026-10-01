Consignes générales : 
- Utilisation stricte de Gitflow et conventional commits : branche main et develop (ne jamais coder dessus) ; utilisation de branches feature/<n°>-<desc>.
-  Utilisation des milestones et labels. 
-  Le code doit respecter les validations de .github/workflows. 
-  Utilisation des principes de design SOLID. 
-  Utilisation de shadcn pour le design de la v0. 
-  Stack : Nuxt3, vue3 script setup, TypeScript strict, Pinia, Vitest. 
-  Dépot Github : https://github.com/Ugravis/wr505d-catalogue. 
-  Ne signe pas les commits avec Claude. 
-  Ne t'occupe pas des PR, c'est mon rôle. 
-  Site référencable. 
-  Aucun any (règle ESLint @typescript-eslint/no-explicit-any en error). Si un type est vraiment inconnu, utiliser unknown puis un narrowing. 
-  Tenir à jour types/dummyjson. 
-  Tiens à jour docs/ai-usage. Chaque prompt doit y figurer, avec : prompt, horodatage, outil (ex Claude), réponse aux éventuelles questions de l'agent. 

Milestone actuelle : week 1. 