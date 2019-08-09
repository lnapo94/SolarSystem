"use strict";

const SERVER_PORT = process.env.port || 80;
let express = require('express');
let path = require('path');

let app = express();

app.use(express.static(path.join(__dirname, './')));

app.listen(SERVER_PORT, function () {
    console.log("The Server is now started");
});