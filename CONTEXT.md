# Documentation Complete du Projet - SAW Multi-Criteria Decision Analysis Tool

## Informations Generales

- **Cours**: M2 2026 - Aide a la Decision et Optimisation Multi-Critere
- **Theme**: Methodes d'agregation par pondération (SAW)
- **Date de creation**: 7 Avril 2026
- **Technologie**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts

---

## Table des Matieres

1. [Contexte du Projet](#contexte-du-projet)
2. [Architecture et Structure](#architecture-et-structure)
3. [Implementations Realisees](#implementations-realisees)
4. [Logique Mathematique](#logique-mathematique)
5. [Guide de Demarrage](#guide-de-demarrage)
6. [Points d'Amelioration](#points-damelioration)

---

## 1. Contexte du Projet<a name="contexte-du-projet"></a>

### 1.1 Objectif

Developper une application web d'aide a la decision multicritere permettant de selectionner des infrastructures d'hebergement (VPS/serveurs) en utilisant la methode SAW (Simple Additive Weighting).

### 1.2 Criteres d'Evaluation

| Critere | Unite | Direction | Description |
|---------|-------|-----------|-------------|
| Monthly Cost | EUR | Minimiser | Frais mensuels d'hebergement |
| RAM | Go | Maximiser | Memoire vive disponible |
| CPU | GHz | Maximiser | Puissance de calcul |
| Bandwidth | Gbps | Maximiser | Bande passante reseau |

### 1.3 Donnees Mockees

10 offres de serveurs ont ete creees avec des caracteristiques variees:
- Basic VPS (5 EUR, 2GB RAM, 2.0 GHz, 0.5 Gbps)
- Standard VPS (15 EUR, 4GB RAM, 2.5 GHz, 1 Gbps)
- Professional (30 EUR, 8GB RAM, 3.2 GHz, 2 Gbps)
- Business (50 EUR, 16GB RAM, 3.8 GHz, 5 Gbps)
- Enterprise (80 EUR, 32GB RAM, 4.2 GHz, 10 Gbps)
- Performance (120 EUR, 64GB RAM, 4.8 GHz, 20 Gbps)
- Budget Server (8 EUR, 4GB RAM, 2.0 GHz, 1 Gbps)
- Ultra Server (200 EUR, 128GB RAM, 5.0 GHz, 25 Gbps)
- Starter Plus (12 EUR, 3GB RAM, 2.2 GHz, 0.8 Gbps)
- Mega Pack (100 EUR, 48GB RAM, 4.5 GHz, 15 Gbps)

---

## 2. Architecture et Structure<a name="architecture-et-structure"></a>

### 2.1 Structure des Fichiers

```
ADOMC/
├── src/
│   ├── app/
│   │   ├── globals.css      # Styles globaux (theme, animations, variables)
│   │   └── page.tsx        # Page principale avec logique SAW integree
│   ├── components/
│   │   ├── ParetoChart.tsx # Graphique de Pareto (Scatter Chart Recharts)
│   │   ├── ServerTable.tsx # Tableau de classement dynamique
│   │   └── WeightSlider.tsx # Slider de ponderation avec feedback visuel
│   ├── lib/
│   │   ├── data.ts         # Donnees mockees des serveurs
│   │   └── saw.ts          # Algorithme SAW complet
│   └── types/
│       └── index.ts        # Definitions TypeScript
├── Dockerfile              # Configuration Docker
├── docker-compose.yml      # Orchestration des services
├── package.json            # Dependances npm
├── tsconfig.json           # Configuration TypeScript
├── README.md              # Documentation principale
└── CONTEXT.md             # Ce fichier de contexte
```

### 2.2 Pile Technologique

- **Framework**: Next.js 16.2.2 (App Router)
- **Langage**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Visualisation**: Recharts 3.8.1
- **Icons**: Lucide React 1.7.0
- **Conteneurisation**: Docker + Docker Compose

---

## 3. Implementations Realisees<a name="implementations-realisees"></a>

### 3.1 Interface Utilisateur

#### Panneau de Controle des Pondérations
- 4 sliders pour repartirl es poids entre les criteres (total = 100%)
- Mise a jour automatique des valeurs
- Codes couleurs distincts:
  - Cout: Rose (#F43F5E)
  - RAM: Cyan (#06B6D4)
  - CPU: Violet (#8B5CF6)
  - Bandwidth: Emerald (#10B981)
- Presets de demonstration pour charger des scenarios de soutenance en un clic

#### Tableau de Classement
- Affichage dynamique des 10 serveurs
- Classement par score global (mise a jour temps reel)
- Indicateurs visuels pour le top 3 (medaille)
- Affichage de tous les criteres et du score pondere
- Boutons de comparaison pour selectionner jusqu'a 3 serveurs

#### Comparaison et Sensibilite
- Comparaison cote a cote des serveurs selectionnes avec leaders par critere
- Analyse de sensibilite interactive sur un critere donne
- Scenarios what-if utiles pour montrer la robustesse de SAW en presentation

#### Graphique de Pareto
- Scatter chart avec Recharts
- Axe X: Cout mensuel
- Axe Y: Score de performance (hors cout)
- Points verts: Solutions Pareto-optimales
- Points gris: Solutions dominees
- Reference line pour le front de Pareto

### 3.2 Design et UX

#### Theme
- Palette de couleurs professionnelle (milieu)
- Fond sombre avec degradations subtils et grain
- Animations d'entree (fade-in, slide-in)
- Effets de survol sur les elements interactifs
- Typographie: Inter (system)

#### Composants Glass
- Panneaux avec effet de transparence et flou (backdrop-filter)
- Bordures subtils pour la profondeur

### 3.3 Logique SAW

#### Normalisation Min-Max
- Criteres a maximiser (RAM, CPU, Bandwidth):
  `rij = (xij - min(xj)) / (max(xj) - min(xj))`
- Criteres a minimiser (Cost):
  `rij = (max(xj) - xij) / (max(xj) - min(xj))`

#### Calcul du Score Global
`Si = Σ (rij × wj)` ou wj est le poids normalise du critere j

#### Identification de Pareto
- Verification de la dominance entre paires de solutions
- Marquage des solutions non-dominees

---

## 4. Guide de Demarrage<a name="guide-de-demarrage"></a>

### 4.1 Installation Locale

```bash
# Installation des dependances
npm install

# Mode developpement
npm run dev

# Production (build puis start)
npm run build
npm run start
```

### 4.2 Docker

```bash
# Lancement avec Docker Compose
docker-compose up -d --build

# Acces a l'application
# http://localhost:3000
```

### 4.3 Commandes Utiles

```bash
# Arreter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Reinstaller les dependances
rm -rf node_modules package-lock.json
npm install
```

---

## 5. Points d'Amelioration<a name="points-damelioration"></a>

### 5.1 Fonctionnalitesujouts Possibles

#### A. Comparison de Scenarios
- Sauvegarder differentes configurations de poids
- Comparer visuellement les classements obtenu
- Boutons de sauvegarde/chargement de scenarios

#### B. Analyse de Sensibilite
- Graphique evoluant des scores selon les ponderations
- Identification des criteres les plus impactants

#### C. Details des Calculs
- Affichage detaille des etapes de normalisation
- Tooltip explicatif sur chaque valeur normalisee
- Vue radar sur le meilleur serveur ou serveur compare

#### D. Export et Partage
- Export du classement en PDF/CSV
- Generation de lien partageable avec les poids encodes

### 5.2 Ameliorations Visuelles

#### A. Graphiques Supplementaires
- Radar chart pour comparer les profils de serveurs
- Bar chart horizontal pour les scores normalises
- Timeline des criteres si ajout de donnees temporelles

#### B. Interactions Avancees
- Drag & drop pour ajuster les poids
- Click sur une ligne du tableau pour voir le detail
- Selection multiple pour comparer 2-3 serveurs

#### C. Animations
- Transition fluide des points sur le graphique Pareto
- Highlight de la ligne correspondante dans le tableau
- Effet de compteur pour les scores

### 5.3 Ameliorations Techniques

#### A. Backend API
- Deplacer la logique SAW dans des API routes Next.js
- Permettre l'ajout/modification de serveurs via formulaire
- Sauvegarde en base de donnees (PostgreSQL/MongoDB)

#### B. Authentification
- Espace utilisateur pour sauvegarder ses configurations
- Historique des analyses effectues

#### C. Tests et Validation
- Tests unitaires pour les fonctions saw.ts
- Tests d'integration pour les composants UI

### 5.4 Suggestions d'Evolution

1. **Mode Expert**: Permettre d'ajouter des criteres personnalises
2. **Algorithmes Supplementaires**: Implementer TOPSIS, VIKOR, Electre
3. **Base de Donnees**: Integrer des donnees reelles d'offres cloud
4. **API Externe**: Connecter a des APIs de fournisseurs (AWS, GCP, Azure)
5. **Dashboard**:Vue d'ensemble avec plusieurs analyses simultanees

---

## Notes pour la Suite du Travail

### Points d'attention

1. **Chemins d'import**: Le projet utilise des alias `@/*` pour les imports (configures dans tsconfig.json)
2. **Build**: Le projet a ete teste et build correctement
3. **Docker**: Les fichiers Dockerfile et docker-compose sont prets
4. **TypeScript**: Verification stricte active (strict: true)

### Environment de Developpement Recommande

- VS Code ou WebStorm/IntelliJ
- Extension Tailwind CSS IntelliJ/VS Code
- Prettier pour le formatage du code

### Commandes de Verification

```bash
# Verifier le build
npm run build

# Lancer le lint
npm run lint

# Verifier TypeScript
npx tsc --noEmit
```

---

## Contact et Resources

- Documentation Next.js: https://nextjs.org/docs
- Documentation Recharts: https://recharts.org/
- Documentation Tailwind: https://tailwindcss.com/docs
- Reference SAW: https://en.wikipedia.org/wiki/Weighted_sum_model

---

*Document genere le 7 Avril 2026*