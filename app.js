var app = require('express')();
const bodyParser = require('body-parser');
const express = require('express');
var path = require('path');

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(express.static(path.join(__dirname, 'www')));

module.exports = { app };