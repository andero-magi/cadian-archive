import express from "express"
import yup from "yup"
import {UserService} from "../user-service.js"

export class UsersController { 
  userService = new UserService

//User schema
  userSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().email().required(),
  });

  constructor() {
  }

  async createUser(req, res) {
    if (!req.body.username ||!req.body.password || !req.body.email)  {
      return res.status(400).send({error: "Invalid user data"});  
    }

    let user = {
      id: this.userService.generateUserId(),
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    }

    user = await this.userService.createUser(user);
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
    
    let user = await this.userService.modifyUser(req.params.id, req.body.username, req.body.password, req.body.email);      
    res.status(200).send(user);
  }

  async getUser(req, res) {
    // If id provided in URL, return the user by ID
    if (req.params.id) {
      let user = await this.userService.getUserById(req.params.id);
      return res.status(200).send(user);
    }

    // If id is not provided, check for username parameter
    const usernameQuery = req.query.username;
    if (usernameQuery) {
      const matchingUsers = await this.userService.getUsersByName(usernameQuery);
      return res.status(200).send(matchingUsers);
    }

    const allUsers = await this.userService.getAllUsers();
    return res.status(200).send(allUsers);
  }

  async deleteUser(req, res) {
    const id = req.params.id;
    const password = req.body.password;

    if (!req.params.id || !req.body.password) {
      return res.status(404).send({ error: "Id and password required" }); 
    }

    const user = await this.userService.getUserById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" }); 
    }

    if (user.password !== password) {
      return res.status(403).send({error: "Password does not match"})
    }

    const success = await this.userService.deleteUser(id);
    if (!success) {
      return res.status(404).send({ error: "Could not Delete User" }); 
    }

    return res.status(200).send({message: "User deleted successfully"});
  }

  async loginUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ error: "Username and password are required" });
    }

    const users = await this.userService.getAllUsers();
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    res.status(200).json({
      message: "Login successful",
      username: user.username,
      id: user.id,
    });
  }  
}