"use strict";

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var fs = require('fs');
var apn = require('apn');
var express = require('express');
var bodyParser = require('body-parser')
var Notifier = require('./notifier.js');

var notifier = new Notifier();

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("hi");
});

app.post('/notify', (req, res) => {
  var ids = req.body.ids;
  var message = req.body.message;
  var badge = req.body.badge || 0;

  var notification = new apn.Notification();
  notification.expiry = 1;
  notification.badge = badge;
  notification.sound = "ping.aiff";
  notification.alert = message;

  notifier.notify(ids, notification);

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
