"use strict";

var redis = require('redis');
var express = require('express');
var apn = require('apn');
var tokenStorage = require('./tokenStorage.js');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function startAPNConnection () {
  return new Promise(function (resolve, reject) {
    var options = {
      // "cert": "./certs/cert.pem",
      // "key": "./certs/key.pem",
      "production": true,

      "batchFeedback": true,
      "interval": 300,
    };

    var apnConnection = new apn.Connection(options);

    var feedbackOptions = {
      "batchFeedback": true,
      "interval": 300
    }
    var feedback = new apn.Feedback(feedbackOptions);
    feedback.on("feedback", function(devices) {
      devices.forEach(function(item) {
        console.log(item);
      });
    });
  });
}

function startApiServer () {
  var app = express();

  app.get('/notify', (req, res) => {
    var id = req.query.id;
    if (!isNumeric(id)) {
      res.sendState(403);
    }

    var notification = new apn.Notification();
    notification.expiry = 1;
    notification.badge = 1234;
    notification.sound = "ping.aiff";
    notification.alert = "poyo";

    var tokens = tokenStorage.getTokensById(req.query.id);
    tokens.forEach((token) => {
      var device = new apn.Device(token);
      apnConnection.pushNotification(notification, device);
    });
  });

  app.get('/register', (req, res) => {
    // tokenStorage.register(req.query.
  });

  app.listen(3000, () => {
    console.log('Notification API Server listening on port 3000');
  });
}

(function () {
  startAPNConnection().then(startApiServer);
});
