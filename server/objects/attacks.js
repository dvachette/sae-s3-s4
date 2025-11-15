const Database = require('better-sqlite3');

class Attack {
    effects;
    name;
    cost;
    description;
    
    constructor(effects, name, cost, description) {
        this.effects = effects;
        this.name = name;
        this.cost = cost;
        this.description = description;
    }

    hit(attackerMember, defenderMember) {
        for (const effect of this.effects) {
            if (effect.type === 'damage') {
                defenderMember.hitpoints -= effect.value * attackerMember.attackMultiplier;
            }
            if (effect.type === 'heal') {
                attackerMember.hitpoints = Math.min(attackerMember.hitpoints + effect.value, attackerMember.maxHitpoints);
            }
        }
    }
}


module.exports = Attack;