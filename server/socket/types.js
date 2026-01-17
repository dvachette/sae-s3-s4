import User from '../objects/user.js';

const types = {
    0: "presidence",
    1: "communication",
    2: "tresorerie",
    3: "secretariat",
    4: "projet",
    5: "local",
    6: "MA",
    7: "MI",
    8: "prevention",
    9: "pioux",
    10: "pls",
    11: "superviseur",
    12: "culture",
    13: "suivi"
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

//etat du combat general
export class CombatState {
    tour;
    player1; // EtatJoueur
    player2; // EtatJoueur
    constructor(tour, player1, player2) {
        this.tour = tour;
        this.player1 = player1;
        this.player2 = player2;
        
    }
    
    init(){
        for(let player of [this.player1,this.player2]){
            const effetsFamilierJoueur = player.familier.modifier;
            
            for(let effect of effetsFamilierJoueur){
                const carteAffectees = this.selectCards(player.userId,effect.target);
                for(let carte of carteAffectees){
                    switch(effect.on){
                        case 'damage' :
                            for(let attaque of carte.attacks){
                                for(let effectAttaque of attaque.effects){
                                    if(effectAttaque.type === 'damage'){
                                        effectAttaque.value += effect.type === 'boost'?effect.value:-effect.value;
                                    }
                                }
                            }
                            break;
                        case 'hitpoints' :
                            carte.hitPoints += effect.type === 'boost'? effect.value:-effect.value;
                            carte.maxHitpoints += effect.type === 'boost'? effect.value:-effect.value;
                            break;
                    }
                }
            }
        }
    }

    static fromPlayersIds(userId1, userId2) {
        const player1UserData = User.fromId(userId1);
        const player2UserData = User.fromId(userId2);
        const initialEnergy = 3;

        // Mélanger les decks des joueurs
        shuffle(player1UserData.deck.cards);
        shuffle(player2UserData.deck.cards);
        player2UserData.deck
        const player1 = new EtatJoueur(
            userId1,
            3, // énergie initiale
            player1UserData.deck.pet,
            new Main(
                player1UserData.deck.cards[0],
                player1UserData.deck.cards[1],
                player1UserData.deck.cards[2],
                player1UserData.deck.cards[3],
                player1UserData.deck.cards[4]
            ),
            player1UserData.deck.arena,
            player1UserData.profilePicture,
            player1UserData.username,
        );

        const player2 = new EtatJoueur(
            userId2,
            3, // énergie initiale
            player2UserData.deck.pet,
            new Main(
                player2UserData.deck.cards[0],
                player2UserData.deck.cards[1],
                player2UserData.deck.cards[2],
                player2UserData.deck.cards[3],
                player2UserData.deck.cards[4]
            ),
            player2UserData.deck.arena,
            player2UserData.profilePicture,
            player2UserData.username,
        );
        return new CombatState(1, player1, player2);

    }

    canPlay(userId) {
        if (this.tour % 2 === 1 && this.player1.userId === userId) {
            return true;
        } else if (this.tour % 2 === 0 && this.player2.userId === userId) {
            return true;
        }
        return false;
    }

    //etat individuel
    getPlayerState(userId) {
        if (this.player1.userId === userId) {
            return new EtatCombatIndividuel(
                this.tour,
                this.tour % 2 === 1,
                this.player1,
                this.player2
            );
        } else if (this.player2.userId === userId) {
            return new EtatCombatIndividuel(
                this.tour,
                this.tour % 2 === 0,
                this.player2,
                this.player1
            );
        } else {
            throw new Error('User not part of this combat');
        }
    }

    detecterDefaite(playerId){   
        const player=this.player1.userId === playerId ? this.player1 : this.player2;
        return player.main.carte1.hitPoints<=0 && player.main.carte2.hitPoints<=0 && player.main.carteActive.hitPoints<=0 && player.main.carte4.hitPoints<=0 && player.main.carte5.hitPoints<=0;
    }

    advanceTurn() {
        this.tour += 1;
        const toPlayPlayer = this.tour % 2 === 1 ? this.player1 : this.player2;
        const finishedPlayer = this.tour % 2 === 1 ? this.player2 : this.player1;
        toPlayPlayer.energie += 1;

        for (const card of [
            toPlayPlayer.main.carte1,
            toPlayPlayer.main.carte2,
            toPlayPlayer.main.carteActive,
            toPlayPlayer.main.carte4,
            toPlayPlayer.main.carte5
        ]) {
            // Appliquer les effets de statut poison et régénération
            for (const effect of card.statusEffects) {
                switch (effect.type) {
                    case 'poison':
                        card.hitPoints -= effect.value;
                        if (card.hitPoints < 0) {
                            card.hitPoints = 0;
                        }
                        break;
                    case 'regen':
                        card.hitPoints += effect.value;
                        if (card.hitPoints > card.maxHitpoints) {
                            card.hitPoints = card.maxHitpoints;
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        // Mettre à jour la durée des effets de statut du joueur dont le tour vient de se terminer
        
        for (const card of [
            finishedPlayer.main.carte1,
            finishedPlayer.main.carte2,
            finishedPlayer.main.carteActive,
            finishedPlayer.main.carte4,
            finishedPlayer.main.carte5
        ]) {
            card.statusEffects = card.statusEffects.filter(effect => {
                if (effect.duration) {
                    effect.duration -= 1;
                    return effect.duration > 0;
                }
                return true; // Effets sans durée restent
            });
        }
            
    }

    attack(attackerId, attackIndex) {


        const attacker = this.player1.userId === attackerId ? this.player1 : this.player2;
        const defender = this.player1.userId === attackerId ? this.player2 : this.player1;
        const attack = attacker.main.carteActive.attacks[attackIndex];
        if (!attack) {
            return false; // Attaque invalide
        }
        if(attacker.main.carteActive.hitPoints<=0){
            return false;
        }

        if (attacker.main.carteActive.statusEffects.some(se => se.type === 'stun')) {
            return false; // La carte est étourdie et ne peut pas attaquer
        }
        const energyCostBonus = attacker.main.carteActive.statusEffects
            .filter(se => se.type === 'rage')
            .reduce((acc, se) => acc - se.value, 0);
        const energyCostPenalty = attacker.main.carteActive.statusEffects
            .filter(se => se.type === 'fatigue')
            .reduce((acc, se) => acc + se.value, 0);
        const cost = Math.max(0, attack.cost + energyCostPenalty - energyCostBonus);
        if (cost <= attacker.energie) {
            for (const effect of attack.effects) {
                const cardsToAffect = this.selectCards(attackerId, effect.target);
                for (const card of cardsToAffect) {
                    if(card.hitPoints<=0){
                        continue;
                    }
                    switch (effect.type) {
                        case 'damage':
                            if (card.statusEffects.some(se => se.type === 'shield')) { // Vérifier si la carte a un effet de bouclier
                                card.statusEffects.find(se => se.type === 'shield').value -= effect.value; // Réduire la valeur du bouclier
                                if (card.statusEffects.find(se => se.type === 'shield').value <= 0) { // Si le bouclier est épuisé, le retirer
                                    card.statusEffects = card.statusEffects.filter(se => se.type !== 'shield');
                                }
                                break; // Sortir du switch sans infliger de dégâts
                            }
                            let damageBonus = attacker.main.carteActive.statusEffects
                                .filter(se => se.type === 'strength')
                                .reduce((acc, se) => acc + se.value, 0);
                            console.log("Types de la carte attaquante :", attacker.main.carteActive.type);
                            console.log("Types de la carte cible :", card.type);
                            console.log("Forces de la carte attaquante :", attacker.main.carteActive.force);
                            console.log("Faiblesses de la carte attaquante :", attacker.main.carteActive.faiblesse);
                            if (attacker.main.carteActive.force.some(typeId => card.type.find(type => type.typeId === typeId))) {
                                damageBonus += 10; // Bonus de dégâts pour la force
                            }
                            if (attacker.main.carteActive.faiblesse.some(typeId => card.type.find(type => type.typeId === typeId))) {
                                damageBonus -= 10; // Malus de dégâts pour la faiblesse
                            }
                            const damagePenalty = attacker.main.carteActive.statusEffects
                                .filter(se => se.type === 'weakness')
                                .reduce((acc, se) => acc + se.value, 0);
                            const totalDamage = Math.max(0, effect.value + damageBonus - damagePenalty);
                            card.hitPoints -= totalDamage
                            console.log(`Card ${card.name} takes ${totalDamage} damage, remaining HP: ${card.hitPoints}`);
                            if (card.hitPoints < 0) {
                                card.hitPoints = 0;
                            }
                            break;
                        case 'heal': 
                            card.hitPoints += effect.value;
                            if (card.hitPoints > card.maxHitpoints) {
                                card.hitPoints = card.maxHitpoints;
                            }
                            break;
                        case 'shield':
                            if (card.statusEffects.some(se => se.type === 'shield')) {
                                card.statusEffects.find(se => se.type === 'shield').value = Math.max(card.statusEffects.find(se => se.type === 'shield').value, effect.value); // Assurer que les boucliers ne s'empilent pas
                            } else {
                                card.statusEffects.push({ type: 'shield', value: effect.value });
                            }
                            break;
                        
                        case 'poison':
                            if (card.statusEffects.some(se => se.type === 'poison')) {
                                card.statusEffects.find(se => se.type === 'poison').value = Math.max(card.statusEffects.find(se => se.type === 'poison').value, effect.value); // Assurer que les poisons ne s'empilent pas
                                card.statusEffects.find(se => se.type === 'poison').duration = Math.max(card.statusEffects.find(se => se.type === 'poison').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'poison', value: effect.value, duration: effect.duration });// met du dégat sur plusieurs tours
                            }
                            break;
                        case 'stun':
                            if (card.statusEffects.some(se => se.type === 'stun')) {
                                card.statusEffects.find(se => se.type === 'stun').duration = Math.max(card.statusEffects.find(se => se.type === 'stun').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'stun', duration: effect.duration }); // empèche d'attaquer
                            }    
                            break;
                        case 'rage':
                            if (card.statusEffects.some(se => se.type === 'rage')) {
                                card.statusEffects.find(se => se.type === 'rage').value = Math.max(card.statusEffects.find(se => se.type === 'rage').value, effect.value); // attaques coutent moins cher
                                card.statusEffects.find(se => se.type === 'rage').duration = Math.max(card.statusEffects.find(se => se.type === 'rage').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'rage', value: effect.value, duration: effect.duration }); // attaques coutent moins cher
                            }    
                            break;
                        case 'fatigue':
                            if (card.statusEffects.some(se => se.type === 'fatigue')) {
                                card.statusEffects.find(se => se.type === 'fatigue').value = Math.max(card.statusEffects.find(se => se.type === 'fatigue').value, effect.value); // attaques coutent plus cher
                                card.statusEffects.find(se => se.type === 'fatigue').duration = Math.max(card.statusEffects.find(se => se.type === 'fatigue').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'fatigue', value: effect.value, duration: effect.duration }); // attaques coutent plus cher
                            }
                            break;
                        case 'strength':
                            if (card.statusEffects.some(se => se.type === 'strength')) {
                                card.statusEffects.find(se => se.type === 'strength').value = Math.max(card.statusEffects.find(se => se.type === 'strength').value, effect.value); // inflige plus de dégats
                                card.statusEffects.find(se => se.type === 'strength').duration = Math.max(card.statusEffects.find(se => se.type === 'strength').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'strength', value: effect.value, duration: effect.duration }); // inflige plus de dégats
                            }    
                            break;
                        case 'weakness':
                            if (card.statusEffects.some(se => se.type === 'weakness')) {
                                card.statusEffects.find(se => se.type === 'weakness').value = Math.max(card.statusEffects.find(se => se.type === 'weakness').value, effect.value); // inflige moins de dégats
                                card.statusEffects.find(se => se.type === 'weakness').duration = Math.max(card.statusEffects.find(se => se.type === 'weakness').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'weakness', value: effect.value, duration: effect.duration }); // inflige moins de dégats
                            }
                            break;
                        case 'regen':
                            if (card.statusEffects.some(se => se.type === 'regen')) {
                                card.statusEffects.find(se => se.type === 'regen').value = Math.max(card.statusEffects.find(se => se.type === 'regen').value, effect.value); // soigne chaque tour
                                card.statusEffects.find(se => se.type === 'regen').duration = Math.max(card.statusEffects.find(se => se.type === 'regen').duration, effect.duration);
                            } else {
                                card.statusEffects.push({ type: 'regen', value: effect.value, duration: effect.duration }); // soigne chaque tour
                            }
                            break;
                        default:
                            console.log(`Unknown effect type: ${effect.type}`);
                            break;
                        
                    } 

                }
            }
            attacker.energie -= cost;
            return true;
        }
        return false;
    }





    /**
     * Sélectionne les cartes cibles en fonction du sélecteur fourni.
     * @param {number} attackerId - L'ID de l'attaquant.
     * @param {string} selector - Le sélecteur définissant les cibles ('self', 'opponent', 'hand', 'opponentHand', etc.).
     * selector.filter -> filtrer les cartes selon leur position (active, main, ...)
     *      self -> sa carte active
     *      opponent -> carte active de l'adversaire
     *      hand -> sa main (sans la carte active)
     *      opponentHand -> main de l'adversaire (sans sa carte active)
     *      all -> toutes les cartes en jeu
     *      allSelf -> toute ses cartes
     *      allOpponent -> toutes les cartes de l'adversaire 
     * 
     * selector.mandat -> filtrer les cartes selon leur mandat (!<mandat> pour exclure un mandat)
     *     SDI -> Seigneur des infos
     *     FBI -> Federal Bureau of Info
     *     MIB -> Men Info Black
     *     SIB -> Super Info Bros
     * 
     * selector.pole -> filtrer les cartes par pôle (!<pole> pour exclure un pôle)
     *      presidence
     *      communication
     *      tresorerie
     *      secretariat
     *      projet
     *      local
     *      MA
     *      MI
     *      prevention
     *      pioux
     *      pls
     *      superviseur
     *      culture
     *      suivi
     * 
     * selector.hitpoints -> filtrer les cartes selon leurs points de vie (>, <, =, >=, <=, !=)
     *      ex: >50, <=30, =100
     * 
     * selector.hasEffect -> filtrer les cartes qui ont un certain effet actif (poison, shield, ...)
     *     TODO: Implémenter les effets actifs sur les cartes
     * 
     * { filter:selfAll, mandat:SDI, pole:!presidence, hitpoints:>50, hasEffect:poison }
     * 
     * @returns 
     */
    selectCards(attackerId, selector) {
        const player = this.player1.userId === attackerId ? this.player1 : this.player2;
        const opponent = this.player1.userId === attackerId ? this.player2 : this.player1;
        let selectedCards = [
            player.main.carte1,
            player.main.carte2,
            player.main.carteActive,
            player.main.carte4,
            player.main.carte5,
            opponent.main.carte1,
            opponent.main.carte2,
            opponent.main.carteActive,
            opponent.main.carte4,
            opponent.main.carte5
        ];

        console.log(`Selector : `, selector);

        for (const critere in selector) {
            switch (critere) {
                case 'filter':
                    if (selector.filter === 'self') {
                        selectedCards =selectedCards.filter(card => [player.main.carteActive].includes(card));
                    } else if (selector.filter === 'opponent') {
                        selectedCards =selectedCards.filter(card => [opponent.main.carteActive].includes(card));
                    } else if (selector.filter === 'hand') {
                        selectedCards = selectedCards.filter(card =>[
                            player.main.carte1,
                            player.main.carte2,
                            player.main.carte4,
                            player.main.carte5
                        ].includes(card));
                    } else if (selector.filter === 'opponentHand') {
                        selectedCards = selectedCards.filter(card => [
                            opponent.main.carte1,
                            opponent.main.carte2,
                            opponent.main.carte4,
                            opponent.main.carte5
                        ].includes(card));
                    } else if (selector.filter === 'allSelf') {
                        selectedCards = selectedCards.filter(card => [
                            player.main.carte1,
                            player.main.carte2,
                            player.main.carteActive,
                            player.main.carte4,
                            player.main.carte5
                        ].includes(card));
                    } else if (selector.filter === 'allOpponent') {
                        selectedCards = selectedCards.filter(card => [
                            opponent.main.carte1,
                            opponent.main.carte2,
                            opponent.main.carteActive,
                            opponent.main.carte4,
                            opponent.main.carte5
                        ].includes(card));
                    } else if (selector.filter === 'all') {
                        // ne rien faire, toutes les cartes sont déjà sélectionnées
                    }
                    break;
                case 'mandat':
                    console.log("mandat selectionne :",selector.mandat);
                    selectedCards = selectedCards.filter(card => {
                        console.log("carte : ",card.name," mandat : ",card.mandat);
                        if (selector.mandat.startsWith('!')) {
                            return card.mandat !== selector.mandat.slice(1);
                        } else {
                            return card.mandat === selector.mandat;
                        }
                    });
                    break;
                case 'pole':
                    selectedCards = selectedCards.filter(card => {
                        const cardTypes = card.type.map(type => types[type.typeId]);
                        console.log("carte : ",card.name," types : ",cardTypes, " filtre pole : ",selector.pole);
                        if (selector.pole.startsWith('!')) {
                            return !cardTypes.includes(selector.pole.slice(1));
                        } else {
                            return cardTypes.includes(selector.pole);
                        }
                    }); 
                    console.log("cartes après filtre pole :",JSON.stringify(selectedCards));
                    break;
                case 'hitpoints':
                    const operator = selector.hitpoints.match(/(>=|<=|!=|=|>|<)/)[0];
                    const value = parseInt(selector.hitpoints.replace(operator, ''));
                    selectedCards = selectedCards.filter(card => {
                        switch (operator) {
                            case '>':
                                return card.hitPoints > value;
                            case '<':
                                return card.hitPoints < value;
                            case '=':
                                return card.hitPoints === value;
                            case '>=':
                                return card.hitPoints >= value;
                            case '<=':
                                return card.hitPoints <= value;
                            case '!=':
                                return card.hitPoints !== value;
                            default:
                                return false;
                        }
                    });
                    break;
                    default:
                        break;
            }
        }
            
        return selectedCards;
    }
    
    swapCard(userId, cardIndex) {
        const player = this.player1.userId === userId ? this.player1 : this.player2;
        const mainCards = [
            player.main.carte1,
            player.main.carte2,
            player.main.carteActive,
            player.main.carte4,
            player.main.carte5
        ];
        if (cardIndex < 0 || cardIndex >= mainCards.length) {
            return false; // Index invalide
        }
        const selectedCard = mainCards[cardIndex];
        if (selectedCard.hitPoints <= 0) {
            return false; // La carte sélectionnée est KO
        }
        // Échanger la carte active avec la carte sélectionnée
        const temp = player.main.carteActive;
        player.main.carteActive = selectedCard;
        switch (cardIndex) {
            case 0:
                player.main.carte1 = temp;
                break;
            case 1:
                player.main.carte2 = temp;
                break;
            case 3:
                player.main.carte4 = temp;
                break;
            case 4:
                player.main.carte5 = temp;
                break;
        }
        return true;
    }
}

export class EtatCombatIndividuel {
    tour; // nombre (numéro du tour actuel)
    monTour; // booléen (true si c'est le tour du joueur)
    moi; // EtatJoueur
    opposant; // EtatJoueur
    constructor(tour, monTour, moi, opposant) {
        this.tour = tour;
        this.monTour = monTour;
        this.moi = moi;
        this.opposant = opposant;
    }
}

export class EtatJoueur {
    userId;
    profilePicture;
    playerName;
    energie; // nombre
    familier; // CarteFamilier
    main; // Objet main
    terrain; // tableau de CarteMembre
    constructor(userId, energie, familier, main, terrain, profilePicture, playerName) {
        this.userId = userId;
        this.energie = energie;
        this.familier = familier;
        this.main = main;
        this.terrain = terrain;
        this.profilePicture = profilePicture;
        this.playerName = playerName;
    }
}

export class Main {
    carte1; // CarteMembre
    carte2; // CarteMembre
    carteActive; // CarteMembre
    carte4; // CarteMembre
    carte5; // CarteMembre
    constructor(carte1, carte2, carteActive, carte4, carte5) {
        this.carte1 = carte1;
        this.carte2 = carte2;
        this.carteActive = carteActive;
        this.carte4 = carte4;
        this.carte5 = carte5;
    }
}

export class CarteMembre {
    name; // chaine de caractères
    hitPoints; // Nombre
    maxHitpoints; // nombre
    attacks; // tableau d'Attaque
    description; // chaine de caractères
    mandat; // chaine de caractères (SDI, FBI, MIB, SIB)
    force; // Tableau d'id de type sur lesquels la carte est forte
    faiblesse; // Tableau d'id de type sur lesquels la carte est faible
    type; // Tableau d'id de types
    statusEffects; // tableau d'effets actifs sur la carte
    constructor(name, hitPoints, maxHitpoints, attacks, description, mandat, force, faiblesse, type, statusEffects) {
        this.name = name;
        this.hitPoints = hitPoints;
        this.maxHitpoints = maxHitpoints;
        this.attacks = attacks;
        this.description = description;
        this.mandat = mandat;
        this.force = force;
        this.faiblesse = faiblesse;
        this.type = type;
        this.statusEffects = statusEffects;
    }
}

export class Attaque {
    effects; // tableau d'Effet
    cost; // nombre (coût en énergie)
    name; // chaine de caractères
    description; // chaine de caractères
    constructor(effects, cost, name, description) {
        this.effects = effects;
        this.cost = cost;
        this.name = name;
        this.description = description;
    }
}

export class CarteFamilier {
    name;
    level;
    description;
    modifierText;
    modifier;
    constructor(name, level, description, modifierText, modifier) {
        this.name = name;
        this.level = level;
        this.description = description;
        this.modifierText = modifierText;
        this.modifier = modifier;
    }
}