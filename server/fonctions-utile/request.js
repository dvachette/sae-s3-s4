const Database=require("better-sqlite3");

function userExisting(mail,username){
    const db=new Database("database.db");
    const checkMailPseudoQuery = db.prepare('SELECT * FROM user WHERE email = ? OR name = ?');
    const existingUser = checkMailPseudoQuery.get(mail, username);
    

    return existingUser? true:false;
}

module.exports={userExisting};