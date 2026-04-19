# Guide de Presentation - SAW ADOMC

## 1. Presentation du theme (2-3 min)

### Contexte
- Decision multicritere pour choisir un serveur VPS.
- Conflit naturel entre plusieurs objectifs: minimiser le cout et maximiser les performances.

### Enjeu
- Eviter une decision basee sur un seul critere.
- Justifier objectivement le choix final face a un professeur ou un client.

## 2. Presentation de l'algorithme SAW (3-4 min)

### Principe
- Normaliser chaque critere sur [0, 1].
- Appliquer une ponderation par critere selon le besoin utilisateur.
- Calculer un score global par somme ponderee.

### Formules
- Criteres a maximiser: rij = (xij - min(xj)) / (max(xj) - min(xj))
- Critere a minimiser (cout): rij = (max(xj) - xij) / (max(xj) - min(xj))
- Score final: Si = somme(rij * wj)

### Valeur pedagogique
- Methode simple a expliquer.
- Transparente: on peut montrer la contribution de chaque critere.

## 3. Demonstration application (5-7 min)

### Etape A - Pre-guide utilisateur
1. Ouvrir le panneau "Pre-guide de besoin".
2. Choisir utilisation, priorite, charge, budget, checklist.
3. Cliquer sur "Generer ma configuration recommandee".
4. Montrer que poids et filtres sont appliques automatiquement.

### Etape B - Analyse des resultats
1. Observer le classement dynamique.
2. Lire le front de Pareto.
3. Montrer le radar du serveur retenu.
4. Ouvrir "Details de calcul SAW" pour expliquer le score.

### Etape C - Interactivite pour la soutenance
1. Utiliser les presets de demonstration.
2. Faire une comparaison directe de 2-3 serveurs.
3. Lancer l'analyse de sensibilite pour la robustesse.
4. Exporter CSV puis PDF.
5. Cliquer sur "Partager" et montrer le lien de scenario.

## 4. Recapitulatif des points importants (1-2 min)

- SAW permet une decision rationnelle et justifiable.
- L'application relie theorie et pratique en temps reel.
- Le pre-guide transforme les besoins metier en criteres formels.
- Les outils de comparaison/sensibilite renforcent la credibilite de la decision.
- Les exports et le lien partageable facilitent la presentation et la tracabilite.

## Questions possibles et reponses courtes

### Pourquoi SAW et pas un autre algorithme ?
SAW est simple, interpretable et adapte a un cadre pedagogique de premiere approche multicritere.

### Comment verifier que le resultat est robuste ?
Via l'analyse de sensibilite: on fait varier les poids et on observe la stabilite du rang.

### Peut-on aller vers du reel ?
Oui: connecter des APIs cloud (AWS/GCP/Azure), ajouter une base de donnees et comparer avec TOPSIS/VIKOR.
