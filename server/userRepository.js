crypto = require('crypto');

function hash(secret){
    return crypto.createHmac('sha256', 'key')
        .update(secret)
        .digest('base64');
}

module.exports.UserRepository = class {

    constructor(db) {
        this.db = db;
    }

    userExists(user) {
        try {
            let { password } = this.db.getData(`/users/${ user.username }`);
            return password == hash(user.password);
        } catch (e) {
            return false;
        }
    }

    addUser({ username, password }) {
        this.db.push(`/users/${ username }`, { password: hash(password) });
    }

}