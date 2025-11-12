class User {
    // Attibuts et méthodes de la classe User
    id;
    username;
    email;
    passwordHash;

    constructor(id, username, email, passwordHash) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    static fromRow(row) {
        return new User(row.id, row.name, row.email, row.passwordHash);
    }

    static fromId(id) {
        const Database = require("better-sqlite3");
        const db = new Database("database.db");

        const getUserByIdQuery = db.prepare('SELECT * FROM user WHERE id = ?');
        const row = getUserByIdQuery.get(id);

        db.close();

        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }

    static fromEmail(email) {
        const Database = require("better-sqlite3");
        const db = new Database("database.db");

        const getUserByEmailQuery = db.prepare('SELECT * FROM user WHERE email = ?');
        const row = getUserByEmailQuery.get(email);

        db.close();

        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }

    static fromUsername(username) {
        const Database = require("better-sqlite3");
        const db = new Database("database.db");

        const getUserByUsernameQuery = db.prepare('SELECT * FROM user WHERE name = ?');
        const row = getUserByUsernameQuery.get(username);

        db.close();

        if (row) {
            return User.fromRow(row);
        } else {
            return null;
        }
    }

    

}