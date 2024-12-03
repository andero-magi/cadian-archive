const UUID = require('uuid');

class UserService {
    #users = {

    };


constructor(){

    }
    
    generateUserId(){
        return UUID.v7();
    }

    getUserById(id) {
        return this.#users[id];
    }


    async createUser(){

        let users = [
            { 
            id: "01938b7d-e200-72c5-9009-6887e02d2338",
            username: "officialdonaldtusk",
            password: "notagermanspy",
            email: "donaldtusk@gmail.com",
            }
          ]
          users.forEach(user => {
            this.#users[user.id] = user;
          });
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
}


module.exports = UserService;