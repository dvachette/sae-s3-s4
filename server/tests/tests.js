const database = require('../include/database.js');

// Test de la connexion à la base de données
function testDatabaseConnection() {

    const db = database.openDatabase("tests/database-test.db");
    const statement = db.prepare("SELECT name FROM table1 WHERE id = 1");
    statement.get((err, row) => {
        if (err) {
            console.error('Erreur lors de la requête:', err.message);
        } else {
            console.log('Résultat de la requête:', row);
        }
    });
    statement.finalize();
    db.close();
}