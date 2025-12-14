# BDE INFO TCG - API
### NA, EF, AG, DV

# Introduction : 
BDE TCG est construit sur le modèle back-end/front-end, qui consiste en une partie front-end qui est l’interface utilisateur de l'application, et d’une partie back-end qui est la partie logique de l’application.

Pour communiquer, le front-end effectue des requêtes HTTP vers une URL du back-end (endpoint), qui lui renvoie les informations demandées, ou effectue les actions demandées.

## `fetch()`
Pour effectuer une requête, il faut utiliser la fonction javascript `fetch()` qui permet de réaliser des requêtes sur le back-end 

Voici un exemple de syntaxe de la fonction `fetch()` :
```javascript
fetch('<url>’, {
  method: 'POST', 
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ foo: 'bar' })
});
```
L’`url` est celui de l’endpoint sur lequel on fait la requête. Dans la documentation, les url données correspondent à la partie après l’adresse du serveur, mais il ne faut pas l’omettre
Le champ `method` indique la méthode HTTP à employer (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`)
La ligne `credentials: 'include'` permet d’activer les outils d’authentification, et est nécessaire pour **TOUS** les appels API de BDE TCG
Le champ headers permet de définir plusieurs en-têtes, nous utiliserons principalement le champ `'Content-Type': 'application/json'` qui spécifie le format de données envoyées au back-end
Le champ `body` contient les informations à envoyer au back-end, dans le format précisé dans les headers (on préfèrera l’emploi de `JSON`)
Les clés du contenu du `body` doivent être exactement celles indiquées dans la documentation

`fetch()` est une fonction asynchrone, ce qui signifie qu’elle est non bloquante. Pour attendre qu’elle ai fini d’effectuer la requête, il faut que la fonction qui effectue le `fetch()` soit définie comme asynchrone, avec le mot clé `async` devant la définition de la fonction :
`async function demo() {}`
Dans la fonction asynchrone, le mot clé `await` peut être placé devant `fetch()` pour attendre la fin de la requête avant de continuer le programme.
On peut ensuite récupérer le résultat et le corps de la requête :
```javascript
async function demo() {
    const response = await fetch(...);
    const data = await response.json();
    // Traiter ensuite les données
}
```
## JSON
### Définition
JSON (JavaScript Object Notation) est un format de données textuel utilisé pour représenter des structures simples : objets, tableaux, valeurs primitives.
Il sert principalement à échanger des données entre systèmes, notamment via des API HTTP.
JSON n’est pas du code : c’est uniquement du texte structuré. 
### Structure générale
Un document JSON contient :
```
Objets : paires clé–valeur, entourées de { }
Tableaux : listes ordonnées, entourées de [ ]
Valeurs :
    chaîne ("texte")
    nombre (42)
    booléen (true, false)
    null (null)
    objet
    tableau
```
### Exemple valide :
```json
{
"key": "value",
"count": 3,
"active": true,
"items": ["a", "b"],
"meta": { "version": 1 }
}
```
### Règles formelles :
 - Les clés sont toujours des chaînes entre guillemets doubles.
 - Les chaînes utilisent exclusivement ".
 - Pas de commentaires.
 - Pas de fonctions, pas de dates, pas d’undefined.
 - Le document doit être valide UTF-8.



### Usage côté JavaScript
Conversion JSON -> objet JS:
`JSON.parse(jsonString)`

Conversion objet JS -> JSON:
`JSON.stringify(obj)`

# Classes
## User
Classe servant à représenter un utilisateur
| Champ | Type | Description |
|:-:|:-:|:-:|
userId|int|Identifiant de l’utilisateur
username|string|Pseudonyme de l’utilisateur
email|string|Adresse email de l’utilisateur
lastBoosterOpening|int|Date de la dernière ouverture de booster (en secondes depuis le 1er janvier 1970), ou null si l’utilisateur n’a pas encore ouvert de booster
balance|int|Nombre de clés possédées par l’utilisateur
collection|Collection[]|Liste représentant la collection de cartes de l’utilisateur
friends|Friend[]|Liste des amis de l’utilisateur
pendingFriendsRequests|FriendRequest[]|Demandes d’amis envoyées en attente de réponse
pendingIncomingFriendRequests|FriendRequest[]|Demandes d’amis reçues en attente
sentTrades|Trade[]|Demandes d’échange envoyées en attente
receivedTrades|Trade[]|Demandes d’échange reçues en attente
acceptedTrades|Trade[]|Historique des échanges


## Collection
Classe servant à représenter un élément de collection ( une carte et une quantité possédée)
| Champ | Type | Description |
|:-:|:-:|:-:|
card|<C extends Card>|Carte possédéec(Pet, Arena, Member) de type Card
quantity|int|Nombre d'exemplaire possédée de la carte

## Card
Classe abstraite représentant une carte
| Champ | Type | Description |
|:-:|:-:|:-:|
cardId|int|Identifiant de la carte
name|string|Nom de la carte
_class|string|Type de la carte (Member, Arena, Pet)
mandat|string|Mandat de la carte (ALL quand ça n'est pas pertinent d'indiquer un mandat, pour les arènes par exemple)
pictureUrl|string|URL de l'image de la carte
description|string|description de la carte
weight|int|Poid de la carte (plus le poid est grand, plus la carte a de chances d'être tirée dans un booster)
level|int|niveau de la carte
borderPictureUrl|string|URL de l'image de la bordure de la carte (changeant avec les niveau)

## Arena
Classe étendant Card pour représenter une carte arène
Arena possède les champs de Card, ainsi que les champs suivants
| Champ | Type | Description |
|:-:|:-:|:-:|
backgroundPictureUrl|String|URL de l'image de fond

## Pet
Classe étendant Card pour représenter une carte familier
Pet possède les champs de Card, ainsi que les champs suivants
| Champ | Type | Description |
|:-:|:-:|:-:|
modifier|object|Le modificateur de la partie donné par le familier, il peut donner divers effets au joueur ou à son adversaire
modifierText|string|Description du modificateur

Le modificateur est un objet anonyme qui possède les champs suivants
| Champ | Type | Description |
|:-:|:-:|:-:|
type|string|"boost" ou "nerf", indique l'action à réaliser
target|string|"owner" ou "opponent", indique le joueur cible du modificateur
on|string|"health", "shield", "poison", "rage","fatigue", "strength", "regen"ou "weakness", indique la statistique affecté
value|int|Indique la valeur de modificationde la statistique affectée
filter|object|filtre optionnel pour cibler ceertaines cartes par champ (mandat, level, type...)

## Member
Classe étendant Card pour représenter une carte membre
Member possède les champs de Card, ainsi que les champs de suivants
| Champ | Type | Description |
|:-:|:-:|:-:|
