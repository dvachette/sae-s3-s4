const Database = require("better-sqlite3");


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
        return new User(row.userId, row.name, row.email, row.password);
    }

    static fromId(id) {
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

    static login(email, password) {
        const db = new Database("database.db");
        const user = User.fromEmail(email);
        db.close();
        if (user && password === user.passwordHash) {
            return user;
        } else {
            return null;
        }
    }
}

module.exports = User;