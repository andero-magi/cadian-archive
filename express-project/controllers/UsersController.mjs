import express from "express"
import yup from "yup"
import {UserService} from "../user-service.js"

export class UsersController{ 
userService = new UserService

/**
 *
 */
constructor() {
  let users = [
    { 
    id: "01938b7d-e200-72c5-9009-6887e02d2338",
    username: "officialdonaldtusk",
    password: "notagermanspy",
    email: "donaldtusk@gmail.com",
    }
  ]
  users.forEach(user => {
    this.userService.createUser(user);
  });
}


createUser(req, res) {
    
    if (!req.body.username ||!req.body.password || !req.body.email)  {
        return res.status(400).send({error: "Invalid user data"});  
      }
      let user = {
        id: this.userService.generateUserId(),
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      }
      users.push(user);
      res.status(201).send(user);
}

async updateUser(req, res) {
    if (req.params.id == null) {
        return res.status(400).send({error: "Invalid user ID"});  
      }
      
      let id = req.params.id;
      let existingUser = await this.userService.getUserById(id);
      if (!existingUser) {
        return res.status(404).send({error: "Id does not exist"});
      }
    
      if (!req.body.username ||!req.body.password || !req.body.email)  {
        return res.status(400).send({error: "Invalid user data"});
      }  
    
        let user = await this.userService.modifyUser(req.params.id, req.body.username, req.body.password)
        
        res.status(200).send(user);
}

async getUser(req, res){
    if (req.params.id == null){
        return
      }
    
      let user = await this.userService.getUserById(req.params.id);
      if (user == null){
        res.status(404).send({error: `User with this ${req.params.id} doesnt exist`});
        return
      }
      return res.status(200).send(user);
}

//dont remember if this works
async deleteUser(req, res) {
  if (!req.params.id) {
      return res.status(404).send({ error: "User not found1" }); 
  }

  const id = req.params.id;
  const user = await this.userService.getUserById(id);

  if (!user) {
      return res.status(404).send({ error: "User not found2" }); 
  }

  const success = await this.userService.deleteUser(id);
  if (!success) {
      return res.status(404).send({ error: "Could not Delete User" }); 
  }

  return res.status(200).send();
}

}