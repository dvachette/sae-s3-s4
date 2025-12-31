const Hash = require('../utils/hashing.js');

async function testHashing() {
    const password = 'Password1!';
    const hashedPassword = await Hash.hashPassword(password);
    console.log(`Hashed Password: ${hashedPassword}`);
    const isMatch = await Hash.checkPassword(password, hashedPassword);
    console.log(`Password match: ${isMatch}`); // Devrait afficher: Password match: true
}
testHashing();