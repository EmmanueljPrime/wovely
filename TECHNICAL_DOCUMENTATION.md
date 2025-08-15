# Documentation Technique - Plateforme Wovely

## Vue d'ensemble du Projet

Wovely est une plateforme de marketplace dédiée à la couture et à la création textile, connectant les clients avec des tailleurs professionnels et particuliers. La plateforme permet la vente de produits finis et la mise en relation pour des créations sur-mesure.

## Architecture Technique

### Technologies Utilisées

- **Frontend** : Next.js 14 avec TypeScript et React
- **Backend** : API Routes Next.js avec architecture serverless
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js avec support OAuth et credentials
- **Styling** : Tailwind CSS avec composants UI personnalisés
- **Optimisation d'images** : Sharp pour la compression automatique
- **Stockage** : Système de fichiers local avec optimisation WebP

### Structure de la Base de Données

La base de données est conçue avec les entités principales suivantes :

#### Utilisateurs et Authentification
- **User** : Utilisateurs principaux avec support NextAuth
- **Account/Session** : Gestion des sessions et comptes OAuth
- **Client/Seller** : Profils spécialisés selon le type d'utilisateur

#### Catalogue et Commerce
- **Product** : Produits avec métadonnées complètes
- **Category/Material/Size/Color** : Système de classification avancé
- **Image** : Gestion des médias avec optimisation automatique
- **ProductStock** : Gestion des stocks par taille

#### Projets et Commandes
- **Project** : Demandes de créations sur-mesure
- **Proposal** : Offres des tailleurs pour les projets
- **Advert** : Annonces publiques des tailleurs
- **Order** : Commandes avec suivi de statut et paiement

#### Communication
- **Message** : Système de messagerie interne
- **Notification** : Alertes et notifications utilisateurs

## Fonctionnalités Détaillées

### 1. Système d'Authentification Multi-Rôles

#### Architecture
- **Rôles** : CLIENT et SELLER avec permissions différenciées
- **Méthodes** : Connexion par email/mot de passe et OAuth (Google, etc.)
- **Sécurité** : Sessions sécurisées avec middleware de protection

#### Inscription Avancée
- **Clients** : Formulaire avec informations personnelles et préférences
- **Tailleurs Particuliers** : Profil avec spécialités et expérience
- **Tailleurs Professionnels** : Informations d'entreprise complètes (SIRET, adresse légale)

### 2. Gestion de Catalogue Avancée (Vendeurs)

#### Création de Produits
- **Formulaire Complet** : Nom, description, prix, catégorie, matériau, taille, couleur
- **Upload d'Images** : Jusqu'à 5 images par produit avec optimisation automatique
- **Optimisation** : Compression WebP, redimensionnement, limite de 500KB par image
- **Validation** : Contrôles de qualité et formats supportés (JPG, PNG, WebP)

#### Affichage et Gestion
- **Interface Moderne** : Grille responsive avec cartes produits
- **Statistiques** : Tableau de bord avec métriques (nombre de produits, valeur totale, stock)
- **Filtres Avancés** : Recherche textuelle, filtrage par catégorie, tri multiple
- **Actions Rapides** : Dropdown menu pour voir, modifier, supprimer

#### Modification de Produits
- **Modal d'Édition** : Interface complète pour modifier tous les champs
- **Gestion d'Images** : Visualisation des images actuelles + ajout de nouvelles
- **Mise à jour Temps Réel** : Actualisation automatique après modification
- **Validation** : Contrôles de cohérence et erreurs explicites

#### Suppression Sécurisée
- **Confirmation** : Dialog de confirmation avec nom du produit
- **Protection** : Impossible de supprimer si commandes en cours
- **Nettoyage** : Suppression automatique des fichiers images
- **Cascade** : Suppression des données liées (images, stocks)

### 3. Système de Recherche et Filtrage

#### Page d'Accueil - Produits
- **Filtres Dynamiques** : Catégorie, matériau, taille, couleur
- **Recherche Textuelle** : Dans nom et description avec insensibilité à la casse
- **URL State** : Filtres persistants dans l'URL pour partage/bookmark
- **Performance** : Requêtes optimisées avec inclusions Prisma

#### Page Tailleurs
- **Filtres Spécialisés** : Services offerts, expérience, type (particulier/pro), ville
- **Profils Complets** : Informations business et contact
- **Géolocalisation** : Filtrage par ville/région

### 4. Système de Projets Sur-Mesure

#### Création de Projets (Clients)
- **Formulaire Détaillé** : Titre, description complète, deadline optionnelle
- **Interface Intuitive** : Modal responsive avec validation temps réel
- **Gestion d'États** : Suivi du statut (pending, accepted, in_progress, completed)

#### Propositions (Tailleurs)
- **Consultation** : Visualisation complète des demandes clients
- **Soumission d'Offres** : Prix, délai, message personnalisé
- **Filtrage** : Recherche par catégorie, localisation, budget

#### Gestion des Propositions (Clients)
- **Modal Avancé** : Visualisation de toutes les propositions reçues
- **Comparaison** : Prix, délais, profils des tailleurs
- **Actions** : Acceptation, refus, contact direct

### 5. Optimisation d'Images Avancée

#### Traitement Automatique
- **Compression** : Réduction intelligente jusqu'à 500KB maximum
- **Format** : Conversion automatique en WebP pour performance
- **Redimensionnement** : Limitation à 1200x1200px avec préservation des proportions
- **Qualité Adaptive** : Réduction progressive si nécessaire

#### Gestion des Erreurs
- **Validation** : Types de fichiers, taille maximum (10MB original)
- **Fallback** : Gestion des erreurs Sharp avec buffer original
- **Feedback** : Messages d'erreur explicites pour l'utilisateur

### 6. Interface Utilisateur et UX

#### Design System
- **Composants** : Système de design cohérent avec shadcn/ui
- **Responsive** : Interface adaptative mobile-first
- **Thème** : Palette cohérente avec couleur principale teal
- **Accessibilité** : Contrastes, navigation clavier, labels appropriés

#### Navigation
- **Header Dynamique** : Adaptation selon le rôle utilisateur (client/vendeur)
- **Sidebar Vendeur** : Navigation dédiée avec dashboard intégré
- **Breadcrumbs** : Navigation contextuelle
- **États de Chargement** : Spinners et skeletons appropriés

#### Feedback Utilisateur
- **Toasts** : Notifications succès/erreur avec react-hot-toast
- **Modals** : Confirmations et formulaires dans des dialogs
- **Validation** : Messages d'erreur en temps réel
- **Progressive Enhancement** : Fonctionnalités dégradées gracieusement

### 7. Gestion des Rôles et Permissions

#### Architecture de Sécurité
- **Middleware** : Protection des routes selon les rôles
- **Hook useRequireRole** : Composant de vérification côté client
- **API Protection** : Vérification session sur chaque endpoint
- **Redirections** : Automatiques vers pages appropriées

#### Interfaces Spécialisées
- **Clients** : Dashboard commandes, projets, favoris, panier
- **Vendeurs** : Dashboard ventes, catalogue, projets, profil business
- **Layouts Adaptatifs** : Structure différente selon le rôle

### 8. Performance et Optimisation

#### Côté Client
- **Code Splitting** : Chargement paresseux des composants
- **Images** : Optimisation Next.js avec lazy loading
- **State Management** : Hooks optimisés pour éviter re-renders
- **Bundle Size** : Optimisation avec tree-shaking

#### Côté Serveur
- **Database** : Requêtes Prisma optimisées avec includes sélectifs
- **Caching** : Headers de cache appropriés
- **Images** : Traitement asynchrone pour éviter timeouts
- **Error Handling** : Gestion robuste des erreurs

### 9. APIs et Endpoints

#### Structure RESTful
```
/api/auth/*           - Authentification NextAuth
/api/client/*         - Endpoints spécifiques clients
/api/seller/*         - Endpoints spécifiques vendeurs  
/api/products/*       - CRUD produits et métadonnées
/api/projects/*       - Gestion projets et propositions
/api/filters/*        - Données pour filtres dynamiques
```

#### Sécurité API
- **Validation** : Schémas de validation stricte
- **Rate Limiting** : Protection contre abuse
- **CORS** : Configuration appropriée
- **Error Responses** : Format JSON standardisé

### 10. Fonctionnalités Avancées

#### Messagerie Interne
- **Système** : Communication directe entre clients et vendeurs
- **Interface** : Messages temps réel avec historique
- **Notifications** : Alertes de nouveaux messages

#### Système de Notifications
- **Types** : Commandes, projets, messages, promotions
- **Personnalisation** : Préférences utilisateur pour types d'alertes
- **Persistance** : Stockage en base avec statut lu/non-lu

#### Dashboard Analytics (Vendeurs)
- **Métriques** : Ventes, revenus, produits populaires
- **Graphiques** : Évolution temporelle des performances
- **Insights** : Recommandations d'optimisation

## Sécurité et Conformité

### Protection des Données
- **RGPD** : Pages légales complètes (privacy policy, terms, CGV)
- **Encryption** : Mots de passe hashés avec bcrypt
- **Session Security** : Tokens sécurisés avec expiration
- **File Upload** : Validation stricte des types et tailles

### Business Logic
- **Validation** : Contrôles métier (stocks, commandes en cours)
- **Audit Trail** : Timestamps sur toutes les entités
- **Data Integrity** : Contraintes base de données
- **Rollback** : Gestion des erreurs avec transactions

## Déploiement et Maintenance

### Environnements
- **Development** : Configuration locale avec hot reload
- **Production** : Optimisations et minification automatiques
- **Database** : Migrations Prisma pour évolution schéma

### Monitoring
- **Error Tracking** : Logs détaillés avec context
- **Performance** : Métriques temps de réponse
- **User Analytics** : Tracking des actions utilisateurs

---

Cette documentation technique couvre l'ensemble des fonctionnalités de la plateforme Wovely, démontrant une architecture robuste et une expérience utilisateur soignée pour le marché de la couture et création textile.
