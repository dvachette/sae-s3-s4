/**
 * @brief Route pour les échanges entre utilisateurs
 * @file server/fonctions-utile/request.js
 * @author Donatien VACHETTE, Elise FOUR
 */
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
function getAllCards(){
    const db=new Database("database.db");
    const getAllCardsQuery = db.prepare('SELECT cardId, weight FROM card');
    const allCards = getAllCardsQuery.all();
    db.close()

    return allCards;
}

function pullCardsRepeat(nb){
    // Récupérer toutes les cartes disponibles

    const allCards = getAllCards();

    // Faire un tirage par poids pour obtenir 5 cartes
    const drawnCards = [];
    let totalWeight = allCards.reduce((sum, card) => sum + card.weight, 0); // Fait la somme des poids

    // Si la plage de poids est nulle (toutes les cartes ont un poids de 0), on évite la division par zéro
    if (totalWeight === 0) {
        // Renvoyer une erreur
        return [];
    }

    for (let i = 0; i < nb; i++) { // Tirer nb cartes
        let randomNum = Math.random() * totalWeight; // Nombre aléatoire entre 0 et le poids total
        for (const card of allCards) { // Parcourir les cartes jusqu'a atteindre le nombre aléatoire
            randomNum -= card.weight;
            if (randomNum <= 0) {
                drawnCards.push(card.cardId); // Ajouter la carte tirée
                break;
            }
        }
    }
    return drawnCards;
}

function pullCardsNoRepeat(nb){
    // Récupérer toutes les cartes disponibles

    const allCards = getAllCards();
    if(allCards.length<nb){
        return [];
    }
    // Faire un tirage par poids pour obtenir 5 cartes
    const drawnCards = [];
    let totalWeight = allCards.reduce((sum, card) => sum + card.weight, 0); // Fait la somme des poids

    // Si la plage de poids est nulle (toutes les cartes ont un poids de 0), on évite la division par zéro
    if (totalWeight === 0) {
        // Renvoyer une erreur
        return [];
    }

    for (let i = 0; i < nb; i++) { // Tirer nb cartes
        let randomNum = Math.random() * totalWeight; // Nombre aléatoire entre 0 et le poids total
        for (const card of allCards) { // Parcourir les cartes jusqu'a atteindre le nombre aléatoire
            randomNum -= card.weight;
            if (randomNum <= 0) {
                drawnCards.push(card.cardId); // Ajouter la carte tirée
                break;
            }
        }
        const drawnCardIndex = allCards.findIndex(c => c.cardId === drawnCards[i]);
        if (drawnCardIndex !== -1) {
            totalWeight -= allCards[drawnCardIndex].weight; // Mettre à jour le poids total
            allCards.splice(drawnCardIndex, 1); // Retirer la carte tirée
        }
    }
    return drawnCards;
}

module.exports={userExisting, addCardToCollection, getAllCards,pullCardsRepeat,pullCardsNoRepeat};