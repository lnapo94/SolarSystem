"use strict";

const SERVER_PORT = process.env.PORT || 8080;
let express = require('express');
let path = require('path');

let app = express();

app.use(express.static(path.join(__dirname, './')));

app.use('/', function (req, res) {
    res.redirect('./index.html');
});

app.use(function(req, res) {
    res.send("404 - Not Found");
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("500 - Internal Server Error");
});

app.listen(SERVER_PORT, function () {
    console.log("The Server is now started at port: " + SERVER_PORT);
});