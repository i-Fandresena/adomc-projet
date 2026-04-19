# SAW Multi-Criteria Decision Analysis Tool

## Cours: M2 2026 - Aide a la Decision et Optimisation Multi-Critere

### Theme: Methodes d'agregation par pondération

---

## Presentation du Projet

Cette application web implemente la **methode SAW (Simple Additive Weighting)** pour l'aide a la decision multicritere dans le contexte de la selection d'infrastructures d'hebergement (VPS/serveurs).

L'application permet de:
- Evaluer et classer 10 offres de serveurs selon 4 criteres
- Ajuster dynamiquement les ponderations des criteres
- Visualiser le front de Pareto pour identifier les solutions optimales
- Comprendre les compromis entre les differentes solutions
- Comparer jusqu'a 3 serveurs cote a cote avec detail des criteres
- Tester des scenarios de demonstration preconfigures
- Realiser une analyse de sensibilite des poids pour montrer la robustesse du classement
- Remplir un pre-guide de besoin (formulaire + checklist) pour generer automatiquement poids et filtres
- Exporter un rapport PDF imprimable du classement courant
- Partager une configuration via un lien URL chargeable automatiquement

---

## Architecture du Systeme

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   UI Layer   │  │  Logic Layer │  │  Visualization   │  │
│  │  (React)     │  │    (SAW)     │  │   (Recharts)    │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────────┤  │
│  │ Sliders      │  │ Normalization│  │ Pareto Chart    │  │
│  │ Server Table │  │ Weight Calc  │  │ Score Display   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (JSON)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Mock Data: 10 Server Offers                           │ │
│  │  - Monthly Cost (EUR)    - RAM (GB)                   │ │
│  │  - CPU (GHz)             - Bandwidth (Gbps)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Fondements Mathematiques

### 1. Methode SAW (Simple Additive Weighting)

La methode SAW est une technique d'agregation lineaire qui calcule un score global pour chaque alternative en additionnant les valeurs normalisees ponderees de chaque critere.

**Principe:**
1. Normalisation des valeurs de chaque critere (echelle [0,1])
2. Application des ponderations decidees par le decideur
3. Calcul du score global par addition ponderee
4. Classement des alternatives selon les scores decroissants

### 2. Formules de Normalisation (Min-Max)

**Pour les criteres a maximiser (RAM, CPU, Bandwidth):**

```
rij = (xij - min(xj)) / (max(xj) - min(xj))
```

**Pour les criteres a minimiser (Cost):**

```
rij = (max(xj) - xij) / (max(xj) - min(xj))
```

Ou:
- `rij` = valeur normalisee de l'alternative i pour le critere j
- `xij` = valeur originale de l'alternative i pour le critere j
- `min(xj)` = valeur minimale du critere j
- `max(xj)` = valeur maximale du critere j

### 3. Calcul du Score Global

```
Si = Σ (rij × wj)
```

Ou:
- `Si` = score global de l'alternative i
- `rij` = valeur normalisee de l'alternative i pour le critere j
- `wj` = poids du critere j (tel que Σ wj = 100%)

### 4. Optimalite de Pareto

Une solution est **Pareto-optimale** si aucune autre solution n'est meilleure sur tous les criteres simultanement. Une solution domine une autre si elle est au moins aussi bonne sur tous les criteres et strictement meilleure sur au moins un.

**Definition formelle:**
```
Solution A domine Solution B si:
  cost(A) ≤ cost(B) ET
  RAM(A) ≥ RAM(B) ET
  CPU(A) ≥ CPU(B) ET
  Bandwidth(A) ≥ Bandwidth(B)
  ET au moins une inegalite stricte
```

---

## Criteres d'Evaluation

| Critere | Unite | Direction | Description |
|---------|-------|-----------|-------------|
| Monthly Cost | EUR | Minimiser | Frais mensuels d'hebergement |
| RAM | Go | Maximiser | Memoire vive disponible |
| CPU | GHz | Maximiser | Puissance de calcul |
| Bandwidth | Gbps | Maximiser | Bande passante reseau |

---

## Guide de Deploiement

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)
- Acces au port 3000

### Installation et Lancement

```bash
# 1. Navigation vers le repertoire du projet
cd adomc

# 2. Construction et lancement avec Docker Compose
docker-compose up -d --build

# 3. Verification de l'etat des conteneurs
docker-compose ps

# 4. Acces a l'application
# Ouvrir http://localhost:3000 dans un navigateur
```

### Commandes Utiles

```bash
# Arreter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f web

# Reconstruire l'image
docker-compose build --no-cache
```

---

## Guide de Demonstration

### Parcours recommande pour la presentation

1. Ouvrir le mode equilibre et presenter la logique SAW.
2. Basculer vers un preset budget ou performance pour montrer l'effet direct des poids.
3. Selectionner 2 ou 3 serveurs dans le tableau puis utiliser la comparaison directe.
4. Lancer l'analyse de sensibilite sur un critere pour illustrer la robustesse de la methode.
5. Terminer par le front de Pareto et les details de calcul pour expliquer le classement.

### Scenario: Ajustement des Pondérations

**Etape 1: Configuration par defaut (poids equitables)**
- Les 4 criteres ont un poids de 25%
- Observer le classement initial des serveurs
- Identifier les solutions Pareto-optimales (points verts)

**Etape 2: Priorité au cout**
- Mettre le poids du Cout a 80%
- Reduire les autres ponderations de maniere equilibree
- Observer le changement de classement vers les solutions moins cheres
- Le graphique Pareto montre le deplacement vers la gauche

**Etape 3: Priorité aux performances**
- Mettre les poids RAM + CPU + Bandwidth a 80% au total
- Reduire le poids du Cout a 20%
- Observer le classement vers les serveurs plus performants
- Le graphique Pareto montre le deplacement vers le haut

**Etape 4: Analyse des compromis**
- Tester des configurations intermediaires
- Identifier les solutions qui restent Pareto-optimales
- Utiliser ces informations pour prendre une decision finale

### Points Cles a Demonstrer

1. **Repartition des poids**: Les sliders permettent une distribution fine des ponderations (total = 100%)

2. **Mise a jour temps reel**: Le classement et le graphique se mettent a jour immediatement lors du changement des poids

3. **Front de Pareto**: Les points verts representent les solutions non-dominees - elles ne peuvent pas etre ameliorees sur un critere sans degrader un autre

4. **Interpretation graphique**: 
   - Axe X = Cout (a minimiser)
   - Axe Y = Score de performance hors cout (a maximiser)
   - Les solutions optimales sont en haut a gauche

5. **Comparaison directe**:
  - Selectionner deux serveurs ou plus dans le tableau
  - Lire les differences de cout, ressources et recommendation
  - Montrer les leaders par critere dans le panneau de comparaison

6. **Sensibilite**:
  - Faire varier un poids de 0 a 100
  - Observer l'evolution du score du serveur selectionne
  - Expliquer si le classement reste stable ou non

---

## Structure du Code

```
adomc/
├── src/
│   ├── app/
│   │   ├── globals.css      # Styles globaux et variables
│   │   └── page.tsx        # Page principale avec logique
│   ├── components/
│   │   ├── ParetoChart.tsx # Graphique de Pareto (Recharts)
│   │   ├── ComparisonPanel.tsx # Comparaison cote a cote des serveurs
│   │   ├── SensitivityPanel.tsx # Analyse what-if sur les poids
│   │   ├── ServerTable.tsx # Tableau de classement
│   │   └── WeightSlider.tsx # Slider de ponderation
│   ├── lib/
│   │   ├── data.ts         # Donnees mockees des serveurs
│   │   ├── weights.ts      # Repartition intelligente des poids
│   │   └── saw.ts          # Algorithme SAW (normalisation, calcul)
│   └── types/
│       └── index.ts        # Definitions de types TypeScript
├── Dockerfile              # Configuration Docker
├── docker-compose.yml      # Orchestration des services
└── package.json            # Dependances npm
```

---

## Technologies Utilisees

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Visualisation**: Recharts
- **Icons**: Lucide React
- **Conteneurisation**: Docker + Docker Compose

---

## Licence

Projet realise dans le cadre du cours M2 2026 - Aide a la Decision et Optimisation Multi-Critere.