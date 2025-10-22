const sqlite3 = require('sqlite3'); // Importation du module sqlite3


// Fonction pour se connecter à la base de données SQLite
function openDatabase(dbFilePath) {
    return new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données:', err.message);
        } else {
            console.log('Connecté à la base de données SQLite.');
        }
    });
}
module.exports = {
    connectToDatabase
};