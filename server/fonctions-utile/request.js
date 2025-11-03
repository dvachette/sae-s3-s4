const Database=require("better-sqlite3");

//penser a ouvrir et ferme la bd et exporter

function userExisting(mail,username){
    const db=new Database("database.db");
    const checkMailPseudoQuery = db.prepare('SELECT * FROM user WHERE email = ? OR name = ?');
    const existingUser = checkMailPseudoQuery.get(mail, username);
    
    db.close()

    return existingUser? true:false;
}

function addCardToCollection(userId,cardId){
    const db=new Database("database.db");
    // Vérifier si l'utilisateur possède déjà la carte
    const checkCardQuery = db.prepare('SELECT * FROM collection WHERE userId = ? AND cardId = ?');
    const existingCard = checkCardQuery.get(userId, cardId);
    if (existingCard) {
        // Si la carte existe déjà, incrémenter la quantité
        const updateCardQuantity = db.prepare('UPDATE collection SET quantity = quantity + 1 WHERE userId = ? AND cardId = ?');
        updateCardQuantity.run(userId, cardId);
    } else {
        // Sinon, insérer la nouvelle carte avec une quantité de 1
        const insertNewCard = db.prepare('INSERT INTO collection (userId, cardId, level, quantity) VALUES (?, ?, 1, 1)');
        insertNewCard.run(userId, cardId);
    }

    db.close()

    
}
module.exports={userExisting, addCardToCollection};