//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");


// #######################################
// ##########    DB Setup        #########
// #######################################
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const myDB = client.db('userDB');
const myCol = myDB.collection('users');



// #######################################
// ##########    General Setup   #########
// #######################################
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// #######################################
// ##########    GET             #########
// #######################################
app.get("/", async function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

// #######################################
// ##########    POST             ########
// #######################################
app.post("/register", async function(req, res){
    await client.connect();
    await myCol.insertOne({user: req.body.username, 
        pass: req.body.password});
    res.render("secrets");
});

app.post("/login", async function(req, res){
    await client.connect();
    const result = await myCol.findOne({user : req.body.username});
        if(result){
            if (result.pass == req.body.password){
                res.render("secrets");
            } else {
                res.send("password is not correct...........");
            }
        } else { 
            res.send("email not found!!!!");
        }
});











// #######################################
// ##########    Listen           ########
// #######################################
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  