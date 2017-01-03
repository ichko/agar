class UserRepository {

    constructor() {
        this.users = [];
    }

    userExists(username) {
        return username == 'user';
    }

    addUser(username, password) {
        this.users.push({ username, password });
    }

}