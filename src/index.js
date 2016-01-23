"use strict";

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var fs = require('fs');
var express = require('express');
var Notifier = require('./notifier.js');

var notifier = new Notifier();

var app = express();

app.get('/', (req, res) => {
  res.send("hi");
});

app.get('/notify', (req, res) => {
  var id = req.query.id;
  var message = req.query.message;
  if (!isNumeric(id)) {
    res.sendState(403);
  }

  var notification = new apn.Notification();
  notification.expiry = 1;
  notification.badge = 1234;
  notification.sound = "ping.aiff";
  notification.alert = message;

  notifier.notify([id], notification);

  res.send(JSON.stringify({status: "OK"}));
});

app.get('/register', (req, res) => {
  var id = req.query.id;
  var token = req.query.token;
  if (!isNumeric(id)) {
    res.sendState(403);
  }

  notifier.register(id, token);

  res.send("pob");
});

app.listen(3000, () => {
  console.log('Notification API Server listening on port 3000');
});
