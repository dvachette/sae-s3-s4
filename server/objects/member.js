const Database = require('better-sqlite3');

const Card = require('./card.js');
const Attack = require('./attacks.js');
class Member extends Card {
    maxHitpoints;
    hitpoints;
    attackMultiplier;
    modifiers;
    attacks;
    statusEffects;
    type;
    force;
    faiblesse;
    constructor(cardId, name, mandat, pictureUrl, description, weight, level, borderPictureUrl, hitpoints, attackMultiplier, attacks,type,force,faiblesse) {
        super(cardId, name, 'member', mandat, pictureUrl, description, weight, level, borderPictureUrl);
        this.hitpoints = hitpoints;
        this.maxHitpoints = hitpoints;
        this.attackMultiplier = attackMultiplier;
        this.modifiers = [];
        this.attacks = attacks;
        this.statusEffects = [];
        this.type=type;
        this.force=force;
        this.faiblesse=faiblesse;
    }
    
    static fromId(id, level) {
        const db = new Database('database.db');

        const getCardByIdQuery = db.prepare('SELECT * FROM card WHERE cardId = ?');
        const cardRow = getCardByIdQuery.get(id);

        if (!cardRow || cardRow.class !== 'member') {
            db.close();
            return null;
        }

        const getMemberByIdQuery = db.prepare('SELECT * FROM member WHERE cardId = ?');
        const memberRow = getMemberByIdQuery.get(id);

        if (!memberRow) {
            db.close();
            return null;
        }
        
        const levelQuery = db.prepare('SELECT * FROM level WHERE cardId = ? AND level = ?');
        const levelRow = levelQuery.get(id, level);
        
        if (!levelRow) {
            db.close();
            return null;
        }

        const getTypesIdsQuery = db.prepare('SELECT * FROM types_des_membres WHERE membreId = ?');
        const typesRows = getTypesIdsQuery.all(id);

        const type = [];
        const force = [];
        const faiblesse = [];

        if (typesRows.length < 1) {
            db.close();
            return null;
        }
        db.close();
        const Type = require("./type.js");
        for (const typeRow of typesRows) {
            const currentType = Type.fromId(typeRow.typeId);
            if (!currentType) {
                continue;
            } else {
                type.push(currentType);
            }
        }
        // Récuperer les forces et faiblesses du type avec la priorité à 1
        const prioType = typesRows.filter(tr => tr.priorite === 1).map(tr => Type.fromId(tr.typeId))[0];
        force.push(...prioType.forceId);
        faiblesse.push(...prioType.faiblesseId);
        const name = cardRow.name;
        const mandat = cardRow.mandat;
        const picture = cardRow.picture;
        const description = cardRow.description;
        const weight = cardRow.weight;
        const borderPicture = levelRow.borderPicture;
        const hitpoints = levelRow.hitpoints;
        const attackMultiplier = levelRow.multiplier;

        const attack1Name = memberRow.attack1Name;
        const attack1Cost = memberRow.attack1Cost;
        const attack1Description = memberRow.attack1Description;
        const attack1Effects = JSON.parse(memberRow.attack1Effects);
        
        const attack2Name = memberRow.attack2Name;
        const attack2Cost = memberRow.attack2Cost;
        const attack2Description = memberRow.attack2Description;
        const attack2Effects = JSON.parse(memberRow.attack2Effects);

        const attacks = []
        attacks.push(new Attack(attack1Effects, attack1Name, attack1Cost, attack1Description));
        if (attack2Name) {
            attacks.push(new Attack(attack2Effects, attack2Name, attack2Cost, attack2Description));
        }
        return new Member(id, name, mandat, picture, description, weight, level, borderPicture, hitpoints, attackMultiplier, attacks, type,force,faiblesse);

    }
}

module.exports = Member;


/*
[
    { type:'heal', target:'<self|opponent|hand|opponentHand>', value:<PV à soigner>}, // soigner
    { type:'damage', target:'<self|opponent|hand|opponentHand>', value:<PV à enlever>}, // faire du dégat
    { type:'shield', target:'<self|opponent|hand|opponentHand>', value:<Nombre de coups protégés>}, // protège contre des coups
    { type:'poison', target:'<self|opponent|hand|opponentHand>', value:<Dégats par tours>, duration:<Durée de l'effet>}, // met du dégat sur plusieurs tours
    { type:'confusion', target:'<self|opponent|hand|opponentHand>', duration:<Durée de l'effet>}, // empèche d'attaquer
    { type:'rage', target:'<self|opponent|hand|opponentHand>', value:<Bonus de cout>, duration:<Durée de l'effet>}, // attaques coutent moins cher
    { type:'fatigue', target:'<self|opponent|hand|opponentHand>', value:<Malus de cout>, duration:<Durée de l'effet>}, // attaques coutent plus cher
]
*/