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



export class CombatState {
    tour;
    player1; // EtatJoueur
    player2; // EtatJoueur
    constructor(tour, player1, player2) {
        this.tour = tour;
        this.player1 = player1;
        this.player2 = player2;
    }
    
    static fromPlayersIds(userId1, userId2) {
        const player1UserData = User.fromId(userId1);
        const player2UserData = User.fromId(userId2);
        const initialEnergy = 3;
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
            player1UserData.deck.arena
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
            player2UserData.deck.arena
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

    advanceTurn() {
        this.tour += 1;
        const toPlayPlayer = this.tour % 2 === 1 ? this.player1 : this.player2;
        toPlayPlayer.energie += 1;
    }

    attack(attackerId, attackIndex) {
        const attacker = this.player1.userId === attackerId ? this.player1 : this.player2;
        const defender = this.player1.userId === attackerId ? this.player2 : this.player1;
        const attack = attacker.main.carteActive.attacks[attackIndex];
        console.log(`Available attacks (${attacker.main.carteActive.attacks.length}) : ${attacker.main.carteActive.attacks}`);
        console.log(`Attacker ${attackerId} is attempting to use attack: ${attack}`);
        console.log(`Attacker energy: ${attacker.energie}, Attack cost: ${attack.cost}`);
        if (attack.cost <= attacker.energie) {
            for (const effect of attack.effects) {
                if (effect.type === 'damage') {
                    let cardsToDamage = this.selectCards(attackerId, effect.target);
                    for (const card of cardsToDamage) {
                        card.hitPoints -= effect.value;
                        if (card.hitPoints < 0) {
                            card.hitPoints = 0;
                        }
                    }
                }
            }
            attacker.energie -= attack.cost;
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

        for (const critere in selector) {
            switch (critere) {
                case 'filter':
                    if (selector.filter === 'self') {
                        selectedCards = [player.main.carteActive];
                    } else if (selector.filter === 'opponent') {
                        selectedCards = [opponent.main.carteActive];
                    } else if (selector.filter === 'hand') {
                        selectedCards = [
                            player.main.carte1,
                            player.main.carte2,
                            player.main.carte4,
                            player.main.carte5
                        ];
                    } else if (selector.filter === 'opponentHand') {
                        selectedCards = [
                            opponent.main.carte1,
                            opponent.main.carte2,
                            opponent.main.carte4,
                            opponent.main.carte5
                        ];
                    } else if (selector.filter === 'allSelf') {
                        selectedCards = [
                            player.main.carte1,
                            player.main.carte2,
                            player.main.carteActive,
                            player.main.carte4,
                            player.main.carte5
                        ];
                    } else if (selector.filter === 'allOpponent') {
                        selectedCards = [
                            opponent.main.carte1,
                            opponent.main.carte2,
                            opponent.main.carteActive,
                            opponent.main.carte4,
                            opponent.main.carte5
                        ];
                    } else if (selector.filter === 'all') {
                        // ne rien faire, toutes les cartes sont déjà sélectionnées
                    }
                    break;
                case 'mandat':
                    selectedCards = selectedCards.filter(card => {
                        if (selector.mandat.startsWith('!')) {
                            return card.mandat !== selector.mandat.slice(1);
                        } else {
                            return card.mandat === selector.mandat;
                        }
                    });
                    break;
                case 'pole':
                    selectedCards = selectedCards.filter(card => {
                        const cardTypes = card.type.map(typeId => types[typeId]);
                        if (selector.pole.startsWith('!')) {
                            return !cardTypes.includes(selector.pole.slice(1));
                        } else {
                            return cardTypes.includes(selector.pole);
                        }
                    }); 
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
    energie; // nombre
    familier; // CarteFamilier
    main; // Objet main
    terrain; // tableau de CarteMembre
    constructor(userId, energie, familier, main, terrain) {
        this.userId = userId;
        this.energie = energie;
        this.familier = familier;
        this.main = main;
        this.terrain = terrain;
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
    constructor(name, hitPoints, maxHitpoints, attacks, description, mandat, force, faiblesse, type) {
        this.name = name;
        this.hitPoints = hitPoints;
        this.maxHitpoints = maxHitpoints;
        this.attacks = attacks;
        this.description = description;
        this.mandat = mandat;
        this.force = force;
        this.faiblesse = faiblesse;
        this.type = type;
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