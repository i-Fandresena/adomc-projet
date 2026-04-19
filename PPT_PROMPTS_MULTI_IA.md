# Prompts IA pour Generer le PowerPoint

Objectif: comparer la qualite de generation de slides entre Dockie AI, Notebook LLM et Claude AI en utilisant exactement le meme contexte.

## Fichiers source a fournir a chaque IA
- PPT_CONTEXT_INTEGRAL_PROJET.md
- PPT_SPEECH_4_PERSONNES.md
- PRESENTATION_GUIDE.md

## Contraintes communes a imposer
- Langue: francais.
- Public: enseignant/jury academique M2.
- Style: professionnel, sobre, moderne.
- Nombre de slides cible: 16 a 20.
- Inclure des sections claires: Theme, SAW, Demo app, Resultats, Limites, Perspectives.
- Ajouter des notes orateur par slide en coherence avec la repartition 4 personnes.
- Ajouter des transitions de parole explicites entre intervenants.

---

## Prompt 1 - Dockie AI
Tu es un expert en presentation academique. A partir des fichiers fournis, genere un plan de presentation PowerPoint complet de 16 a 20 slides.

Exigences:
1. Produire pour chaque slide: titre, 3-5 bullets, message cle, proposition visuelle.
2. Ajouter une section "notes orateur" pour chaque slide.
3. Repartir clairement les prises de parole entre 4 intervenants.
4. Inclure au moins 2 slides sur les formules SAW, 1 slide Pareto, 1 slide sensibilite, 1 slide comparaison serveurs.
5. Conclure avec limites et roadmap.

Format de sortie attendu:
- Slide 1 ... Slide N
- Pour chaque slide: Titre / Contenu / Visuel / Notes orateur / Intervenant.

---

## Prompt 2 - Notebook LLM
Agis comme un coach de soutenance M2. En utilisant les documents fournis, construis un storyboard PowerPoint de 16 a 20 slides pour une presentation de 20 minutes.

Contraintes:
1. Respecter la structure: contexte -> methode SAW -> demo -> recapitulatif.
2. Donner un timing cible par slide.
3. Donner pour chaque slide un mini-script oral (4-6 phrases).
4. Marquer la personne qui parle (P1, P2, P3, P4).
5. Proposer des schemas/tableaux simples a integrer.

Sortie attendue:
- Tableau avec colonnes: slide, objectif, contenu, timing, speaker, script.

---

## Prompt 3 - Claude AI
Tu es consultant senior en MCDA et storytelling technique. A partir des fichiers, genere le contenu d un PowerPoint final pret a produire.

Contraintes fortes:
1. 16 a 20 slides maximum.
2. Niveau academique, clair mais non verbeux.
3. Formules SAW mathematiquement correctes.
4. Storyline fluide entre les 4 intervenants.
5. Chaque slide doit contenir: titre, message central, points de preuve, transition vers slide suivante.
6. Ajouter une slide finale "Q&A" avec 5 questions probables et reponses courtes.

Sortie attendue:
- Plan detaille slide par slide + notes orateur + repartition 4 personnes.

---

## Grille de comparaison des 3 IA (a completer)
Critere | Dockie AI | Notebook LLM | Claude AI
--- | --- | --- | ---
Qualite du plan global |  |  |
Cohesion scientifique (SAW/Pareto) |  |  |
Qualite du speech 4 personnes |  |  |
Clarte des transitions |  |  |
Qualite visuelle proposee |  |  |
Actionnabilite (pret a presenter) |  |  |

## Recommandation d usage
- Etape 1: lancer les 3 prompts sur les 3 IA.
- Etape 2: remplir la grille de comparaison.
- Etape 3: garder la meilleure structure et fusionner les meilleurs passages oraux.
- Etape 4: finaliser le deck dans PowerPoint/Canva/Google Slides.
