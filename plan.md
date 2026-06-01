# Plan d'Architecture et d'Implémentation - CRM Gestion de Patrimoine (KWM)

## Objectif
Garantir une stabilité maximale, une conformité stricte (RGPD, AMF/ACPR) et une évolutivité sans faille pour le CRM. L'architecture doit permettre d'ajouter de nouvelles fonctionnalités (nouvelles intégrations IA, formulaires, outils) sans avoir à réécrire l'existant.

## Stratégie de Stabilité et d'Évolutivité

Pour éviter "l'effet spaghetti" et le besoin de tout reconstruire dans 2 ans, nous allons appliquer 4 règles d'or architecturales :

1. **Le Monorepo (Turborepo) :** Tout le code (Front-end, Back-end, Services IA) vit dans un seul dépôt Git, mais reste parfaitement séparé en modules. Cela permet de partager les *Types de données* (ex: le format d'un profil Client) entre tous les services. Si une règle métier change, tout le système est mis à jour et validé en même temps.
2. **Typage Strict de Bout en Bout (TypeScript & Zod) :** Le back-end et le front-end communiquent via des contrats stricts. Zod validera toutes les données entrantes (depuis les IA ou les utilisateurs). Aucune donnée corrompue ne peut entrer dans la base.
3. **Tests Automatisés (CI/CD) :** Impossible de déployer si les tests échouent.
   - *Tests Unitaires* pour les règles de calcul et de conformité.
   - *Tests End-to-End (Playwright)* pour simuler un utilisateur validant un document.
4. **Infrastructure Conteneurisée (Docker) :** L'application tournera exactement de la même manière sur l'ordinateur du développeur que sur les serveurs de production.

## Architecture Détaillée

- **Front-end / API Gateway :** Next.js (React) + TypeScript + Tailwind CSS
- **Base de données Core :** PostgreSQL (via Prisma ORM)
- **Authentification :** OAuth 2.0 (Application Interne Google Workspace) pour les collaborateurs.
- **Microservice IA (Workspace Connector) :** Node.js ou Python. Écoute les dossiers Drive personnels des conseillers pour extraire et analyser les transcriptions "Appel découverte".
- **Stockage de documents :** AWS S3 (Région Paris) ou Scaleway (Souverain).
- **Piste d'Audit :** Table immuable dans PostgreSQL enregistrant chaque action métier.

## Plan d'Implémentation par Phases

### Phase 1 : Fondations et Outillage (Terminée)
- [x] Création du fichier plan.md
- [x] Initialisation du Monorepo avec Turborepo.
- [x] Configuration de la base de données PostgreSQL en local (Docker) et Prisma.
- [x] Mise en place du pipeline CI/CD (GitHub Actions : Lint, Typecheck).
- [x] Configuration de l'authentification Google OAuth (Structure prête).

### Phase 2 : Core CRM et Fiche Client (Terminée)
- [x] Développement du modèle de données (Schéma Prisma robuste).
- [x] Création du Front-end : Dashboard épuré aux couleurs de Kapex.
- [x] Création de la liste des clients dynamique.
- [x] Développement de la fiche Client détaillée et de la Piste d'Audit associée.
- [x] Mise en place du script de Seed pour les tests.

### Phase 3 : Workspace Connector et Magie de l'IA (Terminée)
- [x] Création du microservice écoutant l'API Google Drive.
- [x] Logique de triage des fichiers "Appel découverte".
- [x] Intégration de Claude (Anthropic) avec Schémas Zod + Prompts experts pour l'extraction de données.
- [x] Configuration de l'authentification OAuth avec scopes Drive.
- [x] Sécurisation par domaine (@nomducabinet.fr).

### Phase 4 : Conformité, Signature et Fichiers (Terminée)
- [x] Implémentation du système d'upload / download sécurisé (S3) via URL signées.
- [x] Configuration de l'API Zoho Sign pour les signatures électroniques (0,50€/doc).
- [x] Interface de gestion des documents et déclenchement des signatures.
- [x] Enregistrement automatique des actions dans la Piste d'Audit.

## Validation & Sécurité
- Revue des accès (Scopes) OAuth Google pour n'avoir accès qu'au strict nécessaire.
- Vérification du mécanisme d'Audit Log immuable.
