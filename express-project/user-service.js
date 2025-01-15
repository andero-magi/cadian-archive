import * as UUID from "uuid"

export class UserService {
    #users = {};


    constructor() {
        this.#users = {}; // create private field
    }

    
    generateUserId(){
        return UUID.v7();
    }

    getUserById(id) {
        return this.#users[id];
    }


    async createUser(userdata){
        this.#users[userdata.id] = userdata;userdata;
    }

modifyUser(id,username, password, email){
    let user = {
        id: id,
        username: username,
        password: password,
        email: email,

        }
        this.#users[user.id] = user;
        return user;
    }

    deleteUser(id) {
        if (this.#users[id]) {
            delete this.#users[id];
            return true;
        }
        return false;
    }
    
    getAllUsers() {
        return Object.values(this.#users);
    }
    
}