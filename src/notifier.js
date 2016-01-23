"use strict";

const apn = require('apn');
const ts = require("./tokenStorage.js");

class Notifier {
  constructor (){
    this.tokenStorage = new ts.tokenStorage();

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

  notify (ids, notification) {
    ids.forEach((id) => {
      var token = this.tokenStorage.getTokensById(id, (tokens) => {
        var device = new apn.Device(token);
        this.apnConnection.pushNotification(notification, device);
      });
    });
  }

  register (id, token) {
    this.tokenStorage.registerToken(id, token);
  }
}