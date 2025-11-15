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
}


module.exports = Attack;