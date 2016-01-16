"use strict";

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var fs = require('fs');
var apn = require('apn');
var express = require('express');
var tokenStorage = require('./tokenStorage.js');

var apnConnection = null;

function startAPNConnection () {
  return new Promise(function (resolve, reject) {
    var cert = fs.readFileSync(__dirname + "/../certs/cert.pem");
    var key = fs.readFileSync(__dirname + "/../certs/key.pem")
    var options = {
      cert: cert,
      key: key,
      production: true,
      batchFeedback: true,
      interval: 300,
    };

    apnConnection = new apn.Connection(options);

    // 通知を1つ送信しないと connected イベントが発火しない模様
    apnConnection.on('connected', () => {
      console.log("APN connection established");
      resolve();
    });

    // なのでとりあえず resolve() しちゃう, 接続できなかった場合は知らん
    resolve();
  });
}

function startApiServer () {
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

    var tokens = tokenStorage.getTokensById(req.query.id, (tokens) => {
      tokens.forEach((token) => {
        var device = new apn.Device(token);
        apnConnection.pushNotification(notification, device);
      });
    });

    res.send(JSON.stringify({status: "OK"}));
  });

  app.get('/register', (req, res) => {
    var id = req.query.id;
    var token = req.query.token;
    if (!isNumeric(id)) {
      res.sendState(403);
    }

    tokenStorage.registerToken(id, token);

    res.send("pob");
  });

  app.listen(3000, () => {
    console.log('Notification API Server listening on port 3000');
  });
}

(function () {
  startAPNConnection().then(startApiServer);
}());
