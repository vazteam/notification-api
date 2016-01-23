"use strict";

const apn = require('apn');
const Notifier = require('./../src/notifier.js');

var notifier = new Notifier();

var notification = new apn.Notification();
notification.expiry = 1;
notification.badge = 1234;
notification.sound = "ping.aiff";
notification.alert = "hoge";

notifier.notify([1], notification);