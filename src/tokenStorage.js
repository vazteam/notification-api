"use strict";

var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class TokenStorage {
  constructor () {
    this.redis = redis.createClient();
  }

  registerToken (id, token) {
    this.lpush(id, token);

  }

  getTokensById (id, callback) {
    client.lrange(id, 0, -1, (err, reply) => {
      callback(reply);
    });
  }
}

exports.tokenStorage = TokenStorage;