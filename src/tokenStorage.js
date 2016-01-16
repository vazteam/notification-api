"use strict";

var redis = require('redis');
var bluebird = require('bluebird');

var exports = module.exports = {};

var client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

exports.registerToken = function (id, token) {
  client.lpush(id, token);
};

exports.getTokensById = function (id) {
  client.lrangeAsync(id, 0, -1).then(function (res) {
    return res;
  });
};
