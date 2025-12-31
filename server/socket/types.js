import User from '../objects/user.js';


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
        if (attack.cost <= attacker.energie) {
            for (const effect of attack.effects) {
                if (effect.type === 'damage') {
                    defender.main.carteActive.hitPoints -= effect.value;
                    defender.main.carteActive.hitPoints = Math.max(defender.main.carteActive.hitPoints, 0);
                }
            }
            attacker.energie -= attack.cost;
            return true;
        }
        return false;
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