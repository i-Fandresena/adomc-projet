# Contexte Integral du Projet ADOMC (pour generation PowerPoint)

## 1. Identite du projet
- Nom: ADOMC - SAW Multi-Criteria Decision Analysis Tool.
- Formation: M2 2026 - Aide a la Decision et Optimisation Multi-Critere.
- Theme: Methodes d agregation par ponderation, avec focus sur SAW (Simple Additive Weighting).
- Objectif principal: aider a choisir une infrastructure serveur (VPS/cloud instance) selon plusieurs criteres contradictoires.

## 2. Probleme traite
Dans un choix d hebergement, plusieurs objectifs entrent en conflit:
- Minimiser le cout mensuel.
- Maximiser les ressources (RAM, CPU).
- Maximiser la bande passante.
Le projet fournit une methode formelle et expliquable pour transformer ces compromis en classement justifie.

## 3. Criteres multicriteres utilises
- Monthly Cost (EUR): a minimiser.
- RAM (GB): a maximiser.
- CPU (GHz/vCPU eq.): a maximiser.
- Bandwidth (Gbps): a maximiser.

## 4. Logique mathematique implementee (SAW)
### Normalisation min-max
- Critere a maximiser:
  rij = (xij - min(xj)) / (max(xj) - min(xj))
- Critere a minimiser (cout):
  rij = (max(xj) - xij) / (max(xj) - min(xj))

### Score global
- Si = somme(rij * wj)
- avec somme des poids = 100%.

### Pareto
- Une offre est Pareto-optimale si aucune autre offre ne l ameliore simultanement sur tous les criteres.
- Identification de domination par comparaison paire a paire.

## 5. Stack technique
- Framework: Next.js 16.2.2 (App Router).
- Langage: TypeScript.
- UI: React + Tailwind CSS.
- Charts: Recharts.
- Icons: Lucide React.
- Tests: Vitest.
- Deploiement local: npm / Docker.

## 6. Evolution fonctionnelle livree
### Version initiale
- Sliders de poids.
- Classement dynamique SAW.
- Front de Pareto.

### Version avancee (etat actuel)
- Dashboard multipage avec sidebar flottante navigable.
- Pre-guide utilisateur (formulaire + checklist) pour proposer automatiquement poids + filtres.
- Comparaison directe de serveurs (jusqu a 3).
- Analyse de sensibilite (what-if).
- Export CSV + export PDF.
- Partage de configuration par URL.
- Tri multi-colonnes sur le tableau.
- Pagination configurable 5 a 50 lignes par page.
- Affichage filtrable ou complet du catalogue.

## 7. Donnees du projet
- Le catalogue serveur a ete fortement etendu et couvre de nombreux fournisseurs/regions/profils.
- Le dataset est structurable, triable, paginable et exploite en temps reel dans l interface.

## 8. Architecture applicative (niveau logique)
- Couche UI: pages dashboard + composants reutilisables.
- Couche metier: moteur SAW, normalisation, score, Pareto, recommandations.
- Couche orchestration: provider de dashboard pour partager et synchroniser l etat sur toutes les pages.
- Couche data: catalogue serveurs + mapping criteres.

## 9. Parcours de demonstration recommande
1. Introduction du contexte de decision multicritere.
2. Explication rapide des formules SAW.
3. Demonstration du pre-guide et generation automatique des criteres.
4. Analyse Pareto + classement + comparaison directe.
5. Sensibilite pour prouver la robustesse.
6. Export et partage pour la tracabilite.

## 10. Points forts academiques
- Methode formelle et expliquable.
- Resultats reproductibles et justifiables.
- Interface orientee demonstration scientifique.
- Transparence des calculs jusqu au niveau detail des contributions.

## 11. Limites actuelles et perspectives
- Donnees principalement construites localement (pas encore full temps reel API cloud).
- Pistes futures: ingestion API AWS/GCP/Azure, comparaison SAW vs TOPSIS/VIKOR/ELECTRE, persistance base de donnees, authentification robuste.

## 12. Livrable attendu pour la soutenance
- Partie 1: presentation du theme.
- Partie 2: presentation de l algorithme.
- Partie 3: demonstration de l application.
- Partie 4: recapitulatif et ouverture.

Utiliser ce document comme source unique de contexte pour demander a une IA de generer un PowerPoint coherent, rigoureux et presentable.
