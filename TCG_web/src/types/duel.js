export class EtatCombat {
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
    energie; // nombre
    familier // CarteFamilier
    main; // Objet main
    terrain; // tableau de CarteMembre
    constructor(energie, familier, main, terrain) {
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