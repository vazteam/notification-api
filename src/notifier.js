"use strict";

const fs = require('fs');
const apn = require('apn');
const TokenStorage = require("./tokenStorage.js");

class Notifier {
  constructor (){
    this.tokenStorage = new TokenStorage();

    var cert = fs.readFileSync(__dirname + "/../certs/cert.pem");
    var key = fs.readFileSync(__dirname + "/../certs/key.pem");
    var options = {
      cert: cert,
      key: key,
      production: true,
      batchFeedback: true,
      interval: 300,
    };
    this.apnConnection = new apn.Connection(options);
  }

  sendNotification(token, notification) {
    var device = new apn.Device(token);
    this.apnConnection.pushNotification(notification, device);
  }

  notify (ids, notification) {
    ids.forEach((id) => {
      this.tokenStorage.getTokensById(id, (tokens) => {
        tokens.forEach((token) => {
          this.sendNotification(token, notification);
        });
      });
    });
  }

  notifyAll (notification) {
    var tokens = this.tokenStorage.getAllTokens((tokens) => {
      tokens.forEach((token) => {
        this.sendNotification(token, notification);
      });
    });
  }

  register (id, token) {
    this.tokenStorage.registerToken(id, token);
  }
}

module.exports = Notifier;