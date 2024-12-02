const port = 8080
const app = require('express')();
const swaggerUI = require
("swagger-ui-express");
const swaggerDoc = require("./CadianArchive/docs/swagger.json");
var express = require('express');
let games = [    {id: 1, name: "Game 1" },
    {id: 2, name: "Game 2" },
    {id: 3, name: "Game 3" }];

app.get("/games", (req,res) => {res.send(games);});

app.use("/docs", swaggerUI.serve, 
    swaggerUI.setup(swaggerDoc)
);
app.use(express.json());


app.get("/games", (req,res) => {res.send(games)})

app.get("/games/:id", (req,res) => {
    if (typeof games[req.params -1] === "undefined") 
        {return res.status(404).send({error: "Game not found"});  }
    if (req.params.id == null) {
        return res.status(400).send({error: "Invalid game ID"});  }
    res.send(gmaes[req.params.id -1]) 
})


app.post("/games", (req,res) => {
    if (!req.body.name)  {
        return res.status(400).send({error: "Invalid game data"});  }
    
    let game = {id: games.length + 1, name: req.body.name}
    games.push(game);
    res.status(201).location(`${getBaseURL(req)}/games/${games.length}`).send(game);
})

app.put("/games/:id", (req,res) => {
    if (req.params.id == null) {
        return res.status(400).send({error: "Invalid game ID"});  }
    
    if (!req.body.name )  {
        return res.status(400).send({error: "Invalid game data"});  }

    let game = {
        id: req.body.id,
        name: req.body.name
    }
    games.splice((re1.body.id - 1), 1, game);
    res.status(201).location(`${getBaseURL(req)}/games/${games.length}`).send(game)
    .send(game);
})

app.delete("/games/:id", (req,res) => {
    if (req.params.id == null) {
        return res.status(400).send({error: "Invalid game ID"});  }
        
    games.splice((req.params.id - 1), 1);
    res.status(204).send();
})

app.listen(port, () => console.log(`Cadian Archive API listening on port ${port}`))


app.delete("/games/:id", (req,res) => {
    if (typeof games[req.params.id - 1] === "undefined") {
        return res.status(404).send({error: "Game not found"});  
    }
    games.splice((req.params.id - 1), 1);
    res.status(204).send();})

function getBaseURL(req) { 
    return req.connection && req.connection.encrypted ?
    "https" : "http" + `://${req.headers.host}`; 
}