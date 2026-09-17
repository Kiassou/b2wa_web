<div align="center">

# 🌍 B2WA

### **Business to West Africa**
### *The West African Business Network*

<p>
  <strong>Une plateforme digitale pensée pour connecter les entreprises, fournisseurs, commerçants et communautés à travers l'Afrique de l'Ouest.</strong>
</p>

<p>
  <a href="#-à-propos">À propos</a> •
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-structure-du-projet">Structure</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

<br>

<img src="src/assets/icons/b2wa_logo.png" alt="B2WA Logo" width="180">

<br><br>

![Status](https://img.shields.io/badge/status-active%20development-16a34a?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-CSS-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-111827?style=for-the-badge)

</div>

---

## ✦ Sommaire

- [🌍 À propos](#-à-propos)
- [🎯 Vision](#-vision)
- [✨ Fonctionnalités](#-fonctionnalités)
- [👥 Types d'utilisateurs](#-types-dutilisateurs)
- [🏘️ Système de communautés](#️-système-de-communautés)
- [📡 Lives & publications](#-lives--publications)
- [🛒 Marketplace & produits](#-marketplace--produits)
- [🚚 Commandes & expéditions](#-commandes--expéditions)
- [🔔 Notifications](#-notifications)
- [🔐 Authentification & sécurité](#-authentification--sécurité)
- [🎨 Identité visuelle](#-identité-visuelle)
- [🏗️ Architecture](#️-architecture)
- [🧰 Stack technique](#-stack-technique)
- [📁 Structure du projet](#-structure-du-projet)
- [⚙️ Prérequis](#️-prérequis)
- [🚀 Installation](#-installation)
- [💻 Développement](#-développement)
- [📦 Build & déploiement](#-build--déploiement)
- [🧪 Tests](#-tests)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)
- [👨‍💻 Auteur](#-auteur)

---

## 🌍 À propos

**B2WA — Business to West Africa** est une plateforme web conçue pour créer un réseau professionnel et commercial numérique orienté vers l'Afrique de l'Ouest.

L'objectif est de réunir dans un même environnement :

- 🏢 fournisseurs et entreprises ;
- 🛍️ vendeurs et acheteurs ;
- 👥 communautés professionnelles et commerciales ;
- 📦 produits et offres ;
- 🔴 événements et sessions Live ;
- 💬 échanges et discussions ;
- 🚚 suivi des commandes et expéditions ;
- 🔔 notifications personnalisées.

B2WA cherche ainsi à créer un espace où les utilisateurs peuvent **découvrir, publier, vendre, échanger, suivre leurs activités et développer leur réseau**.

> **B2WA — Connecter les entreprises. Créer des opportunités. Construire le commerce de demain en Afrique de l'Ouest.**

---

## 🎯 Vision

La vision de B2WA est de construire progressivement un écosystème numérique capable de rapprocher les acteurs économiques de la région.

### Les grands objectifs

| Objectif | Description |
|---|---|
| 🌐 Connexion | Mettre en relation les acteurs professionnels et commerciaux |
| 🛒 Commerce | Faciliter la découverte et la présentation de produits |
| 🏘️ Communautés | Créer des espaces de collaboration autour d'intérêts communs |
| 📡 Live | Permettre aux créateurs de présenter leurs activités en direct |
| 💬 Interaction | Encourager les échanges entre membres |
| 🚚 Logistique | Donner de la visibilité sur le cycle d'expédition |
| 🔔 Information | Informer chaque utilisateur des événements qui le concernent |

---

# ✨ Fonctionnalités

## 🧭 Explorer

L'espace **Explorer** permet de découvrir le contenu disponible sur la plateforme.

Selon les fonctionnalités activées, l'utilisateur peut notamment retrouver :

- communautés ;
- produits ;
- publications ;
- Lives ;
- offres ;
- contenus commerciaux.

Chaque élément peut mener vers une vue détaillée adaptée au contexte.

---

## 🏘️ Communautés

Le système de communautés constitue l'un des piliers de B2WA.

Un fournisseur/créateur peut créer et gérer ses propres communautés afin de rassembler des membres autour d'une activité ou d'un thème.

### Fonctionnalités

- création de communauté ;
- limitation à **3 communautés maximum par fournisseur/créateur** ;
- nom et informations de la communauté ;
- gestion des membres ;
- publications ;
- produits ;
- Lives ;
- réservations ;
- discussions ;
- lien partageable ;
- espace administrateur du créateur ;
- espace de consultation pour les visiteurs et membres.

### Deux espaces distincts

```text
Community Detail
      │
      ├── Espace du créateur / administrateur
      │
      ├── Gestion de la communauté
      ├── Publications
      ├── Produits
      ├── Lives
      ├── Membres
      └── Réservations

Community View
      │
      ├── Vue visiteur / membre
      ├── Découverte
      ├── Publications
      ├── Produits
      ├── Lives
      └── Discussions
```

---

# 📡 Lives & publications

B2WA prévoit une expérience dynamique permettant aux créateurs et fournisseurs de présenter leurs activités.

### 🔴 Live

Un créateur peut :

1. programmer un Live ;
2. générer un lien partageable ;
3. informer sa communauté ;
4. permettre aux membres/visiteurs d'accéder à la session ;
5. associer le Live à son espace communautaire.

### 📝 Publications

Les communautés peuvent publier du contenu pour informer ou engager leurs membres.

Exemples :

- annonces ;
- nouveautés ;
- présentation de produits ;
- informations commerciales ;
- événements ;
- contenus de communauté.

---

# 🛒 Marketplace & produits

B2WA intègre une logique orientée commerce permettant aux fournisseurs de présenter leurs produits.

### Un produit peut être associé à :

- un fournisseur ;
- une communauté ;
- une publication ;
- une offre ;
- une vente flash ;
- une commande.

L'objectif est de créer un parcours cohérent :

```text
Découverte
   ↓
Produit
   ↓
Interaction
   ↓
Commande
   ↓
Expédition
   ↓
Suivi
```

---

# ⚡ Ventes flash

Les **Flash Sales** permettent de mettre en avant des offres commerciales limitées.

Une vente flash peut être utilisée pour :

- attirer l'attention sur un produit ;
- créer un sentiment d'urgence ;
- communiquer une offre spéciale ;
- notifier les utilisateurs concernés.

---

# 🚚 Commandes & expéditions

B2WA prévoit un système permettant de suivre le cycle logistique d'une commande.

Le suivi peut évoluer selon différents états d'expédition.

### Exemple de cycle

```text
Commande créée
      ↓
Commande confirmée
      ↓
Préparation
      ↓
Expédition
      ↓
En transit
      ↓
Arrivée / livraison
      ↓
Terminée
```

Chaque changement important peut déclencher une notification adaptée au rôle et au contexte de l'utilisateur.

---

# 🔔 Notifications

Le système de notification est conçu pour informer l'utilisateur des événements qui le concernent.

### Types de notifications

| Type | Exemple |
|---|---|
| `system` | Information générale de la plateforme |
| `community` | Nouvelle communauté ou événement communautaire |
| `post` | Nouvelle publication |
| `live` | Live programmé ou démarré |
| `flash_sale` | Nouvelle vente flash |
| `product` | Information liée à un produit |
| `order` | Mise à jour d'une commande |
| `shipment` | Changement de statut d'expédition |
| `member` | Événement concernant un membre |

### Principe

Les notifications sont pensées pour être **contextuelles**.

```text
Événement
   ↓
Identification du contexte
   ↓
Identification du rôle concerné
   ↓
Création de la notification
   ↓
Affichage dans l'espace utilisateur
```

---

# 👥 Types d'utilisateurs

B2WA est conçu autour de plusieurs profils pouvant avoir des responsabilités différentes.

| Profil | Responsabilités principales |
|---|---|
| 👤 Utilisateur / membre | Explorer, rejoindre, interagir, recevoir des notifications |
| 🏪 Fournisseur | Publier, présenter des produits, gérer ses communautés |
| 👑 Créateur / admin communauté | Administrer une communauté et ses contenus |
| 🛒 Acheteur | Découvrir des produits et suivre ses commandes |
| 🚚 Acteur logistique | Participer au suivi des expéditions |
| 🛡️ Administrateur plateforme | Superviser et administrer la plateforme |

> Les permissions réelles sont destinées à être centralisées côté backend lorsque celui-ci sera intégré.

---

# 🔐 Authentification & sécurité

L'application frontend est préparée pour fonctionner avec un système d'authentification et d'autorisation.

Les éléments prévus comprennent :

- inscription ;
- connexion ;
- utilisateur courant ;
- rôles ;
- permissions ;
- protection des routes ;
- gestion de session ;
- notifications personnalisées ;
- séparation des espaces utilisateurs.

L'architecture est pensée pour permettre l'intégration future d'une API backend sécurisée.

---

# 🎨 Identité visuelle

B2WA possède une identité visuelle orientée **business, technologie, commerce et Afrique de l'Ouest**.

### Palette conceptuelle

| Couleur | Utilisation |
|---|---|
| 🟢 Vert | croissance, commerce, énergie, confiance |
| 🔵 Bleu | technologie, réseau, professionnalisme |
| ⚪ Blanc | clarté et lisibilité |
| 🌑 Navy / sombre | profondeur et contraste |

Le design utilise notamment des surfaces modernes, des gradients subtils, des cartes, des effets de profondeur et des interfaces responsive.

### Direction artistique

```text
MODERNE
   +
PREMIUM
   +
PROFESSIONNEL
   +
AFRICAIN
   +
TECHNOLOGIQUE
   =
B2WA
```

---

# 🖥️ Expérience utilisateur

B2WA est conçu pour offrir une expérience cohérente sur :

- 💻 Desktop ;
- 💻 Laptop ;
- 📱 Mobile ;
- 📱 petits écrans.

Les interfaces privilégient :

- navigation claire ;
- composants réutilisables ;
- cartes interactives ;
- feedback utilisateur ;
- états de chargement ;
- responsive design ;
- hiérarchie visuelle ;
- interactions simples.

---

# 🏗️ Architecture

Le projet frontend est construit avec une architecture Angular moderne.

### Vue globale

```text
                         ┌─────────────────────┐
                         │       B2WA          │
                         │  Web Application     │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
                Public          Community       User Area
                    │               │               │
                    │               │               │
                    ▼               ▼               ▼
               Explorer        Community       Dashboard
               Products        Posts           Notifications
               Services        Lives           Orders
               Auth            Members         Shipments
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ▼
                             Future Backend API
                                    │
                                    ▼
                              Database / Services
```

---

# 🧰 Stack technique

## Frontend

| Technologie | Utilisation |
|---|---|
| **Angular 20** | Framework principal |
| **TypeScript** | Langage |
| **Bootstrap CSS** | Base UI / responsive |
| **Angular Router** | Navigation |
| **Standalone Components** | Architecture des composants |
| **RxJS** | Gestion réactive |
| **HTML5 / CSS3** | Structure et design |

## Backend prévu / intégration future

L'architecture est conçue pour pouvoir communiquer avec une API backend.

Les responsabilités backend pourront notamment couvrir :

- authentification ;
- utilisateurs ;
- rôles ;
- communautés ;
- produits ;
- publications ;
- Lives ;
- commandes ;
- expéditions ;
- notifications ;
- persistance des données.

---

# 📁 Structure du projet

Structure indicative du frontend :

```text
b2wa_web/
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── services/
│   │   │   └── models/
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── community/
│   │   │   ├── community-detail/
│   │   │   ├── community-view/
│   │   │   ├── explorer/
│   │   │   ├── notifications/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── ...
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   └── pipes/
│   │   │
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── ...
│   │
│   ├── index.html
│   └── styles.css
│
├── public/
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

> La structure exacte peut évoluer avec l'intégration progressive des nouvelles fonctionnalités.

---

# ⚙️ Prérequis

Avant de lancer B2WA, installer :

- **Node.js**
- **npm**
- **Angular CLI**
- **Git**

Vérifier les versions :

```bash
node --version
npm --version
ng version
git --version
```

---

# 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Kiassou/b2wa_web.git
```

### 2. Entrer dans le projet

```bash
cd b2wa_web
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Lancer le serveur de développement

```bash
ng serve
```

Puis ouvrir :

```text
http://localhost:4200
```

---

# 💻 Développement

### Lancer le serveur

```bash
ng serve
```

### Lancer avec ouverture automatique du navigateur

```bash
ng serve --open
```

### Générer un composant

```bash
ng generate component features/example
```

### Générer un service

```bash
ng generate service core/services/example
```

### Compiler le projet

```bash
ng build
```

### Compiler en mode production

```bash
ng build --configuration production
```

---

# 📦 Build & déploiement

Le projet peut être compilé avec :

```bash
ng build --configuration production
```

Le résultat est généré dans le dossier `dist/`.

Selon l'environnement de déploiement, le dossier de sortie peut être configuré dans `angular.json`.

### Avant un déploiement

Vérifier :

- `base href` ;
- routes Angular ;
- assets ;
- images ;
- variables d'environnement ;
- URLs d'API ;
- configuration de production ;
- règles de fallback SPA du serveur.

---

# 🧪 Tests

Les tests pourront être exécutés avec les commandes Angular configurées dans le projet.

Exemple :

```bash
ng test
```

Pour les tests de build :

```bash
ng build --configuration production
```

---

# 🗺️ Roadmap

## Phase 01 — Frontend

- [x] Architecture Angular
- [x] Navigation principale
- [x] Pages publiques
- [x] Explorer
- [x] Communautés
- [x] Vue communauté
- [x] Espace communauté
- [x] Publications
- [x] Produits
- [x] Lives
- [x] Notifications
- [ ] Finalisation UX/UI globale

## Phase 02 — Backend

- [ ] API REST
- [ ] Base de données
- [ ] Authentification réelle
- [ ] Gestion des utilisateurs
- [ ] Gestion des rôles
- [ ] Gestion des communautés
- [ ] Gestion des produits
- [ ] Gestion des commandes
- [ ] Gestion des expéditions
- [ ] Système de notifications persistant

## Phase 03 — Commerce

- [ ] Panier
- [ ] Commandes
- [ ] Paiement
- [ ] Historique
- [ ] Vente flash avancée
- [ ] Gestion fournisseur

## Phase 04 — Temps réel

- [ ] Notifications temps réel
- [ ] Chat
- [ ] Discussions temps réel
- [ ] Live avancé
- [ ] Suivi logistique temps réel

## Phase 05 — Production

- [ ] Tests automatisés
- [ ] Sécurité renforcée
- [ ] Monitoring
- [ ] Optimisation performances
- [ ] CI/CD
- [ ] Documentation API

---

# 🔄 Flux fonctionnels principaux

## Flux communauté

```text
Fournisseur
    ↓
Création de communauté
    ↓
Personnalisation
    ↓
Publication de contenus
    ↓
Ajout de produits / Lives
    ↓
Partage du lien
    ↓
Visiteurs / Membres
    ↓
Interactions
```

## Flux produit

```text
Fournisseur
    ↓
Publication produit
    ↓
Exploration
    ↓
Découverte
    ↓
Interaction
    ↓
Commande
    ↓
Préparation
    ↓
Expédition
    ↓
Suivi
    ↓
Livraison
```

## Flux notification

```text
Nouvel événement
       ↓
Analyse du contexte
       ↓
Utilisateur concerné
       ↓
Type de notification
       ↓
Notification créée
       ↓
Badge / centre de notifications
       ↓
Lecture
```

---

# 🧩 Principes techniques

Le développement de B2WA suit plusieurs principes :

### ♻️ Réutilisabilité

Les composants communs doivent être réutilisables afin d'éviter la duplication du code.

### 🧱 Séparation des responsabilités

Les fonctionnalités métier, composants partagés, modèles et services doivent rester organisés.

### 📱 Responsive first

Les interfaces doivent rester utilisables sur mobile comme sur desktop.

### 🎨 Cohérence visuelle

Les nouvelles fonctionnalités doivent respecter l'identité visuelle B2WA.

### 🔒 Sécurité

Les contrôles sensibles doivent être réalisés côté serveur lorsque le backend sera en production.

### 🚀 Évolutivité

L'architecture doit permettre l'ajout progressif de nouvelles fonctionnalités sans réécriture globale.

---

# 🌐 Dépôt

**Repository :**

`https://github.com/Kiassou/b2wa_web`

Le dépôt contient le frontend de la plateforme B2WA.

---

# 🤝 Contribution

Les contributions sont les bienvenues.

### Workflow recommandé

```bash
git checkout -b feature/ma-fonctionnalite
```

Développer la fonctionnalité puis :

```bash
git add .
git commit -m "feat: ajout de ma fonctionnalité"
```

Puis :

```bash
git push origin feature/ma-fonctionnalite
```

### Convention de commits

| Préfixe | Utilisation |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction |
| `style:` | UI / CSS / formatage |
| `refactor:` | Refactorisation |
| `docs:` | Documentation |
| `test:` | Tests |
| `chore:` | Maintenance |

---

# 📌 Statut du projet

> **B2WA est actuellement en développement actif.**

Certaines fonctionnalités sont déjà disponibles côté frontend tandis que d'autres sont prévues pour les prochaines étapes d'intégration backend et de production.

---

# 📄 Licence

Ce projet est distribué sous licence **MIT**.

Voir le fichier `LICENSE` pour les conditions complètes.

---

# 👨‍💻 Auteur

<div align="center">

### **THIERO Gaoussou — Kiassou**

**Full Stack Developer • Cloud • DevOps • Cybersecurity**

Bamako, Mali 🇲🇱

<br>

> *Building digital solutions for Africa.*

<br>

**B2WA — Business to West Africa**

*The West African Business Network*

</div>

---

<div align="center">

### 🌍 B2WA

**Connect • Discover • Sell • Collaborate • Grow**

<br>

⭐ Si le projet vous intéresse, vous pouvez laisser une étoile au repository.

</div>
#   b 2 w a _ w e b  
 