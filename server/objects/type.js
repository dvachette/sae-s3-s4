const Database = require('better-sqlite3');

class Type{
    typeId;
    name;
    icon;
    color;
    forceId;
    faiblesseId;

    constructor(typeId,name,icon,color,forceId,faiblesseId){
        this.typeId=typeId;
        this.name=name;
        this.icon=icon;
        this.color=color;
        this.forceId=forceId;
        this.faiblesseId=faiblesseId;
    }

    static fromId(id){
        const db=new Database("database.db");

        const getTypeByIdQuery = db.prepare('SELECT * FROM Type WHERE typeId = ?');
        const row = getTypeByIdQuery.get(id);

        const getForceIdQuery = db.prepare('SELECT faiblesseId FROM Force_et_faiblesse WHERE forceId = ?');
        const forceRows =getForceIdQuery.all(id);

        const getFaiblesseIdQuery = db.prepare('SELECT forceId FROM Force_et_faiblesse WHERE faiblesseId = ?');
        const faiblesseRows =getFaiblesseIdQuery.all(id);

        db.close();

        const forcesId = [];
        const faiblessesId = [];

        for(const forceRow of forceRows){
            forcesId.push(forceRow.faiblesseId);
        }

        for(const faiblesseRow of faiblesseRows){
            faiblessesId.push(faiblesseRow.forceId);
        }

        return new Type(row.typeId,row.name,row.icon,row.color,forcesId,faiblessesId);
    }

}