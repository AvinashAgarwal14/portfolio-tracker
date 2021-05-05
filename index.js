const express = require("express");
const app = express();

app.get('/', function(req, res) {
    res.send("Hi!");
});

app.listen(5000, function(req, res){
    console.log("Server Started!");
});