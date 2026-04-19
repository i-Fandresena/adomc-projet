# Speech de Presentation Reparti pour 4 Personnes

Duree cible totale: 18 a 22 minutes.

## Repartition globale
- Personne 1: contexte + problematique + objectifs (4-5 min)
- Personne 2: methode SAW + fondements mathematiques (5-6 min)
- Personne 3: demo produit (6-7 min)
- Personne 4: analyse critique + conclusion + perspectives (4-5 min)

## Personne 1 - Contexte et cadrage
### Message central
Nous presentons un outil d aide a la decision multicritere pour choisir un serveur de maniere objective.

### Script suggere
Bonjour a tous. Notre projet s inscrit dans le module d aide a la decision multicritere. Le probleme est simple en apparence, mais complexe en pratique: comment choisir un serveur quand les criteres sont contradictoires?

Si nous regardons uniquement le prix, nous risquons de choisir une solution sous-dimensionnee. Si nous regardons uniquement la performance, le cout devient difficilement soutenable. Notre objectif est donc de structurer cette decision avec une methode formelle, transparente et defendable.

Nous avons developpe une application web qui permet de comparer des offres selon quatre criteres: cout, RAM, CPU et bande passante. L utilisateur peut ajuster les poids, poser des contraintes, visualiser les compromis, et obtenir un classement justifie.

Transition: je passe maintenant la parole a la personne 2 qui va expliquer le coeur mathematique de la solution.

## Personne 2 - Methode SAW et rigueur
### Message central
La valeur scientifique du projet repose sur la normalisation, la ponderation et la logique Pareto.

### Script suggere
Merci. Le moteur central de notre application est la methode SAW, Simple Additive Weighting. Cette methode suit trois etapes.

Etape 1: normaliser les criteres. Comme les unites sont differentes, nous ramenons tout sur une echelle commune entre 0 et 1. Pour les criteres a maximiser, nous utilisons la formule min-max classique. Pour le cout, qui est a minimiser, la formule est inversee.

Etape 2: appliquer les poids. Chaque critere recoit une importance relative selon le besoin metier de l utilisateur. La somme des poids est maintenue a 100%.

Etape 3: calculer le score global. Le score d une offre est la somme des valeurs normalisees multipliees par leurs poids. Nous obtenons alors un classement ordonne.

En plus du classement, nous faisons une analyse Pareto. Cela permet d identifier les solutions non dominees, c est-a-dire les offres pour lesquelles on ne peut pas ameliorer un critere sans en degrader au moins un autre.

Transition: la personne 3 va montrer comment ces principes sont utilises en direct dans l application.

## Personne 3 - Demonstration produit
### Message central
L application transforme la theorie SAW en decisions exploitables, interactives et justifiables.

### Script suggere
Nous passons a la demonstration.

D abord, nous ouvrons le pre-guide utilisateur. Ce module demande le contexte: type d usage, priorite business, charge attendue, budget, et checklist technique. A partir de ces informations, l application propose automatiquement des poids SAW et des filtres.

Ensuite, nous visualisons le classement dans l onglet Classement. Le tableau est triable par colonne, paginable, et peut afficher l ensemble du catalogue. Nous pouvons comparer jusqu a trois serveurs cote a cote pour expliciter les compromis.

Sur l onglet Visualisation, nous affichons le front de Pareto et le radar de profil. Cela rend les compromis lisibles rapidement.

Sur l onglet Sensibilite, nous faisons une analyse what-if: on fait varier un poids et on observe si le top classement reste stable. C est un point cle pour prouver la robustesse de la recommendation.

Enfin, nous exportons en CSV/PDF et nous partageons la configuration via URL pour garantir la tracabilite.

Transition: la personne 4 va conclure avec l evaluation globale et les perspectives.

## Personne 4 - Conclusion et perspectives
### Message central
Le projet est fonctionnel, pedagogique, et evolutif vers un usage plus industriel.

### Script suggere
En synthese, notre projet apporte trois contributions principales.

Premiere contribution: une decision multicritere explicable, basee sur une methode mathematique claire.
Deuxieme contribution: une interface de demonstration complete qui relie theorie, visualisation et preuve de robustesse.
Troisieme contribution: des fonctions de restitution et de partage qui rendent la decision reutilisable.

Sur les limites, nous reconnaissons que les donnees peuvent etre encore enrichies via des APIs cloud en temps reel. C est une perspective directe, avec aussi la comparaison de SAW avec TOPSIS, VIKOR ou ELECTRE.

Pour conclure, nous montrons qu une approche multicritere bien implementee permet de passer d une decision intuitive a une decision defendable, mesurable et communicable.

Merci pour votre attention, nous sommes disponibles pour les questions.

## Questions potentielles et reponses courtes
- Pourquoi SAW?
  SAW est interpretable, rapide et pedagogiquement pertinent pour une premiere approche multicritere.
- Comment verifier la robustesse?
  Avec l analyse de sensibilite: on observe l impact des variations de poids sur les rangs.
- Quelle prochaine etape?
  Connecter des sources cloud temps reel et comparer plusieurs algorithmes multicriteres.
