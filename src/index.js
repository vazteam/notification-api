"use strict";

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var fs = require('fs');
var apn = require('apn');
var express = require('express');
var bodyParser = require('body-parser');
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
  var sound = req.body.sound || "ping.aiff";
  var payload = req.body.payload || {};

  var incrementBadge = !req.body.noIncrementBadge;

  var notification = new apn.Notification();
  notification.expiry = 1;
  notification.badge = badge;
  notification.sound = sound;
  notification.alert = message;
  notification.payload = payload;

  notifier.notify(ids, notification, incrementBadge);

  res.send(JSON.stringify({
    status: "OK"
  }));
});

app.post('/broadcast', (req, res) => {
  var message = req.body.message;
  var badge = req.body.badge || 0;
  var sound = req.body.sound || "ping.aiff";
  var payload = req.body.payload || {};

  var incrementBadge = !req.body.noIncrementBadge;

  var notification = new apn.Notification();
  notification.expiry = 1;
  notification.sound = "ping.aiff";
  notification.alert = message;
  notification.payload = payload;

  notifier.notifyAll(notification, incrementBadge);

  res.send(JSON.stringify({
    status: "OK"
  }));
});

app.post('/register', (req, res) => {
  var id = req.body.id;
  var token = req.body.token;
  if (!isNumeric(id)) {
    res.sendState(403);
  }

  notifier.register(id, token);

  res.send(JSON.stringify({
    status: "OK"
  }));
});

app.post('/clearBadgeCount', (req, res) => {
  var id = req.body.id;
  notifier.clearBadgeCount(id);

  var notification = new apn.Notification();
  notification.expiry = 1;
  notification.badge = 0;

  notifier.notify([id], notification, false);

  res.send(JSON.stringify({
    status: "OK"
  }));
});

app.listen(3000, () => {
  console.log('Notification API Server listening on port 3000');
});
