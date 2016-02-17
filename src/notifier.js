"use strict";

const fs = require('fs');
const apn = require('apn');
const TokenStorage = require("./tokenStorage.js");
const winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/notifier.log' });

class Notifier {
  constructor (){
    this.tokenStorage = new TokenStorage();

    var cert = fs.readFileSync(__dirname + "/../certs/cert.pem");
    var key = fs.readFileSync(__dirname + "/../certs/key.pem");
    var connectionOptions = {
      cert: cert,
      key: key,
      production: true,
    };
    this.apnConnection = new apn.Connection(connectionOptions);
    this.apnConnection.on('transmissionError', this.transmissionError);

    var feedbackOptions = {
      cert: cert,
      key: key,
      batchFeedback: true,
      interval: 300
    };
    var feedback = new apn.Feedback(feedbackOptions);
    feedback.on("feedback", this.feedback);
  }

  sendNotification(token, notification) {
    var device = new apn.Device(token);
    this.apnConnection.pushNotification(notification, device);
  }

  notify (ids, notification) {
    ids.forEach((id) => {
      this.tokenStorage.getTokensById(id, (tokens) => {
        tokens.forEach((token) => {
          winston.debug(`Token: ${token}`);
          this.sendNotification(token, notification);
        });
      });
    });
    winston.info(`ids: ${ids.join(', ')}`);
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

  transmissionError (errCode, notification, device) {
    var token = device.token.toString('hex')
    winston.error(`Notification caused error: ${errCode} (Device token: ${token})`);
  }

  feedback (devices) {
    console.log(devices);
  }
}

module.exports = Notifier;
