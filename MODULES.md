# Tartiflette : format des modules

Ce document décrit le format des fichiers que l’appli sait lire. Il sert de référence pour produire de nouveaux modules à partir d’un fichier « demandes » exporté depuis l’appli.

## Trois types de modules

**Un domaine** (par exemple `espace.json`) contient un sujet complet : présentation, notions, frise, enquête, glossaire, figures.

**Une extension** (par exemple `espace-portraits-1.json`) complète un domaine existant sans le remplacer. Elle porte `"type": "extension"` et `"target": "<id du domaine>"`.

**Un module de thèmes** (par exemple `themes-saisons.json`) ajoute des palettes de couleurs. Il porte `"type": "themes"`.

Tous s’installent de la même façon : déposés dans le dossier `packs/` du site et listés dans `packs/index.json`, ou importés depuis l’écran Réglages, puis Modules.

## La règle d’or : des identifiants stables

La progression (tampons, révisions, notes) est rangée sous les identifiants : `domaine/notion` pour une notion, `domaine/notion/niveau` pour une révision. Tant qu’on ne change pas l’identifiant d’une notion, on peut réécrire ses textes, ajouter des niveaux ou des questions : la progression est conservée. Supprimer une notion ne supprime pas la progression ; elle redevient visible si la notion revient.

Les identifiants s’écrivent en minuscules, sans accents ni espaces : `trous-noirs`, `leavitt`, `cmb`.

## Versions

Chaque module porte un `"version"` entier. Quand le même module existe à deux endroits (site et import), l’appli garde la version la plus élevée. Pour publier une correction, on augmente la version.

## Structure d’un domaine

```json
{
  "id": "espace", "title": "L’Espace", "emoji": "🪐", "short": "Espace",
  "subtitle": "…", "accent": "#3E4BB8", "accentDark": "#9AA6FF",
  "version": 2, "knowledge": "Novembre 2026",
  "question": "La question fil rouge de l’enquête",
  "intro": "…",
  "resources": [ … ],
  "notions": [ … ],
  "people": [ { "id": "leavitt", "n": "Henrietta Swan Leavitt", "aliases": ["Henrietta Leavitt", "Leavitt"], "y": "1868–1921", "d": "Paragraphe", "lesson": "Leçon complète (facultatif)", "resources": [ … ] } ],
  "timeline": [ { "id": "leavitt", "sort": 1912, "y": "1912", "t": "Titre", "d": "Texte enrichi", "people": ["leavitt"], "open": "Ce qui restait en suspens à ce moment-là", "notions": ["distances"] } ],
  "inquiry": [ { "id": "piste-1", "q": "Question", "intro": "…", "notions": ["lumiere"], "conclusion": "…" } ],
  "glossary": [ { "id": "parsec", "t": "Parsec", "d": "Définition" } ]
}
```

Une notion :

```json
{
  "id": "distances", "title": "…", "glyph": "pc", "summary": "…",
  "minutes": [4, 12, 25], "prereq": ["lumiere"], "next": ["galaxies"],
  "levels": {
    "1": { "adds": "Ce que ce niveau apporte", "text": "Texte enrichi", "quiz": [ { "q": "Question", "o": ["A", "B", "C"], "a": 0, "e": "Explication" } ] },
    "2": { … }, "3": { … }
  },
  "misconceptions": [ { "myth": "…", "truth": "…" } ],
  "debates": [ { "t": "Titre", "d": "Explication" } ],
  "figures": ["bessel", "leavitt"],
  "resources": [ { "type": "livre|article|cours|video|recherche", "title": "…", "author": "…", "lang": "fr|en", "url": "…", "level": 1, "note": "…" } ]
}
```

Chaque niveau a cinq questions ; quatre bonnes réponses donnent le tampon. L’ordre des réponses est mélangé à chaque passage, l’indice `a` désigne la bonne réponse dans la liste d’origine.

Sous-notions : une notion qui porte `"parent": "tokyo"` devient une sous-notion de Tokyo. Elle se déplie sous sa notion parente dans le parcours, apparaît dans une section dédiée de la fiche parente, et la navigation précédente/suivante suit l’arbre (parent, puis ses sous-notions dans l’ordre, puis la notion suivante). Sur la notion parente, `childrenLabel` (« Quartiers ») et `childLabel` (« Quartier ») nomment les sous-notions. Un seul niveau de sous-notions est recommandé sous une notion ordinaire.

Catégories : une notion qui porte `"group": true` est une catégorie, sans niveaux ni test. Elle a un `emoji`, un `title`, un `summary` court et une `intro` en texte enrichi, et un `rank` qui fixe son ordre dans le parcours. Les notions qui lui appartiennent portent `"parent": "<id de la catégorie>"`. Une notion d’une catégorie peut elle-même avoir des sous-notions (Villes › Tokyo › quartiers). Les catégories ne reçoivent pas de tampon et ne comptent pas dans la progression ; la navigation précédente/suivante les saute.

## Texte enrichi

Paragraphes séparés par une ligne vide. `## Titre` pour un intertitre, `- ` pour une liste, `> ` pour un encadré, `**gras**`.

- `[[distances]]` ou `[[distances|texte]]` : lien vers une notion du même domaine.
- `[[philosophie:vivant|texte]]` : lien vers une notion d’un autre domaine (affiché avec l’étiquette du domaine ; si le domaine n’est pas installé, le lien propose de l’ajouter aux demandes).
- `[[@leavitt]]` ou `[[@leavitt|texte]]` : lien vers le portrait d’une figure du même domaine ; `[[japon:@hokusai|Hokusai]]` pour une figure d’un autre domaine.
- `{{parsec}}` ou `{{parsec|texte}}` : terme du glossaire du domaine.

Les noms des figures sont aussi reliés automatiquement : la première occurrence d’un de leurs `aliases` dans un texte (fiche, frise, idée reçue, débat, portrait) devient un lien vers leur portrait. Choisir des alias sans ambiguïté (« Edwin Hubble » plutôt que « Hubble », qui désigne aussi un télescope).

Le texte enrichi est accepté dans les niveaux, les leçons, les paragraphes des figures, les descriptions et les questions en suspens de la frise, les idées reçues et les débats.
- `::figure spectre`, `::figure parallaxe`, `::figure expansion` : schémas interactifs fournis par le moteur.

## Structure d’une extension

```json
{
  "type": "extension", "id": "espace-etoiles-2", "target": "espace", "version": 1, "order": 2,
  "title": "Étoiles : niveaux Intermédiaire et Expert",
  "description": "…",
  "set": { "knowledge": "Décembre 2026" },
  "notions": [
    { "id": "etoiles", "levels": { "2": { "adds": "…", "text": "…", "quiz": [ … ] } }, "resources_add": [ … ] },
    { "id": "etoiles-neutrons", "after": "etoiles", "title": "…", "glyph": "n", "levels": { "1": { … } } }
  ],
  "people": [ { "id": "chandrasekhar", "n": "…", "y": "…", "d": "…", "lesson": "…" } ],
  "timeline": [ { "id": "pulsars", "sort": 1967, "y": "1967", "t": "…", "d": "…", "notions": ["etoiles"] } ],
  "glossary": [ { "id": "pulsar", "t": "Pulsar", "d": "…" } ],
  "inquiry": [ … ],
  "resources_add": [ … ]
}
```

Règles de fusion, appliquées dans l’ordre `order` :

- Notion existante : chaque champ fourni remplace l’ancien. Dans `levels`, chaque niveau est fusionné champ par champ ; `quiz_add` ajoute des questions au lieu de les remplacer.
- Un champ suffixé `_add` (`misconceptions_add`, `debates_add`, `resources_add`, `figures_add`) ajoute des éléments à la liste existante.
- Notion nouvelle : elle est insérée après la notion indiquée par `after`, ou à la fin.
- `people`, `timeline`, `glossary`, `inquiry` : fusion par `id` (complète l’élément existant, ou l’ajoute).
- `set` : remplace des champs du domaine (par exemple la date d’état des connaissances).

## Ton et chemin pédagogique

Chaque niveau est un cours, pas une notice d’encyclopédie : on part d’une question ou d’une situation, on avance une idée à la fois, on annonce où l’on va et on récapitule à la fin (encadré « À retenir » ou « En résumé »). L’utilisateur est tutoyé.

- **Découverte** : très bienveillant, chaleureux, rassurant. Des analogies du quotidien à chaque étape (un chœur, un réverbère, un pain aux raisins), aucun prérequis, peu de chiffres et toujours concrets. Trois à cinq paragraphes courts.
- **Intermédiaire** : plus scolaire, façon « un ami qui m’explique une notion que je ne connais pas ». Il s’adresse au lecteur (« je te propose de… »), explique le pourquoi de chaque étape, raconte l’histoire de la découverte, propose au moins un exemple chiffré résolu pas à pas. L’équivalent d’une à deux pages.
- **Expert** : académique et précis (équations, ordres de grandeur, limites des méthodes, état de la recherche), avec une pointe d’émerveillement de passionné : une accroche qui souligne ce que la notion a de vertigineux, et quelques remarques enthousiastes sur les détails les plus beaux. Les débats ouverts y sont traités sérieusement.

Les idées reçues, les débats et les portraits font un vrai paragraphe chacun, pour qu’on comprenne de quoi il retourne.

## Structure d’un module de thèmes

```json
{
  "type": "themes", "id": "themes-saisons", "version": 1, "title": "Saisons et fêtes", "emoji": "🗓️", "description": "…",
  "themes": [
    { "id": "halloween", "name": "Halloween", "emoji": "🎃", "dark": true, "season": ["10-20", "11-01"], "priority": 2,
      "vars": { "paper": "#14100D", "surface": "#1F1813", "ink": "#F3E8DD", "muted": "#B9A693", "line": "#3A2C21", "soft": "#2A2019", "l1": "#B79CFF", "l2": "#FF8A2A", "l3": "#E7C15A", "ok": "#7BD389", "bad": "#FF6E5E" } }
  ]
}
```

`paper` est le fond, `surface` celui des cartes, `ink` le texte, `muted` le texte secondaire, `line` les bordures, `soft` les fonds discrets ; `l1`, `l2`, `l3` sont les encres des niveaux Découverte, Intermédiaire et Expert, qui doivent rester bien distinctes. `season` (mois-jour de début et de fin, qui peut chevaucher le Nouvel An) rend le thème éligible au mode « Selon la saison » ; en cas de chevauchement, la plus grande `priority` l’emporte. `dark` indique un thème sombre.

## Ce que produit une demande

Une demande ne se limite pas à un paragraphe : elle doit s’intégrer au réseau existant. Pour une nouvelle notion (par exemple le paradoxe d’Olbers), l’extension contient selon les besoins :

- la notion elle-même, avec au moins le niveau Découverte et son test, idéalement les trois niveaux ;
- ses liens `prereq` et `next`, et des liens wiki dans le texte vers les notions voisines ;
- les mises à jour des notions existantes qui devraient y renvoyer (via `levels` ou `*_add`), pour que le lien existe dans les deux sens ;
- les nouveaux termes du glossaire, les jalons de la frise (avec `people` et `open`), et les figures concernées, avec un portrait (et une leçon si c’est demandé) ;
- une piste d’enquête si la notion répond à une question nouvelle, ou un ajout à une piste existante ;
- des ressources vérifiées.

Une demande rattachée à aucun domaine installé (domaine `_libre` ou nouveau domaine nommé) se traite ainsi : si elle relève clairement d’un domaine existant, on produit une extension de ce domaine ; sinon, on crée un nouveau domaine complet, avec la notion demandée et les notions nécessaires pour la comprendre, organisées en parcours, avec frise, glossaire et enquête. Les liens entre domaines (`[[espace:…]]`) relient le nouveau domaine aux anciens.

## Fichier « demandes »

L’export de l’écran « À développer » produit un fichier de type `demandes`, qui liste les modules installés (avec les identifiants des notions et des figures) et les demandes : domaine, type, référence, libellé et précision. Il contient aussi, dans `notes`, les notes que l’utilisateur a écrites sur les fiches (sauf si l’option est désactivée) : domaine, notion, niveau lu (`levelRead`) et texte. Ce sont souvent des questions (« que se passe-t-il si je tombe dans une planète gazeuse ? ») : y répondre en complétant le niveau concerné, dans le ton de ce niveau.

La réponse attendue est une extension (ou un domaine complet pour un nouveau sujet) qui respecte les identifiants existants.


## Thème d’accueil et journal des nouveautés

Un domaine peut porter un champ `theme` (« Sciences », « Histoire et géographie », « Sciences humaines », « Philosophie », « Numérique ») utilisé par le tri « Par thème » de l’accueil.

Un domaine ou une extension peut porter un champ `news` : une liste d’entrées `{ "id": "identifiant-unique", "date": "AAAA-MM-JJ", "text": "Ce qui a changé", "notions": ["id1", "id2"] }`. Tant qu’une entrée n’a pas été vue, le sujet affiche « Nouveau » sur l’accueil, une carte « Depuis ta dernière visite » apparaît à l’ouverture du sujet, et chaque notion citée garde le repère jusqu’à ce qu’elle soit ouverte. L’identifiant doit être unique et ne jamais être réutilisé.

## Mise à jour groupée

Le fichier `tartiflette-mise-a-jour.json` est de type `bundle` et contient tous les modules. Chaque module porte une date de construction `_built` : l’appli garde toujours la version la plus récente, qu’elle vienne du site ou d’un import.
