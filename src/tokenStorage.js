"use strict";

const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class TokenStorage {
  constructor () {
    this.redis = redis.createClient();
    this.registerLock = false;
  }

  registerToken (id, token) {
    var timerId = setInterval(() => {
      if (this.registerLock === false) {
        this.registerLock = true;
        clearInterval(timerId);
      }
    }, 50);

    this.redis.get(`token:${token}`, (err, res) => {
      var multi = this.redis.multi();

      if (res !== null) {
        multi.lrem(`id:${res}`, 0, token);
      }

      multi.lpush(`id:${id}`, token);
      multi.set(`token:${token}`, id);

      multi.exec();
    });

    this.registerLock = false;
  }

  getTokensById (id, callback) {
    this.redis.lrange(`id:${id}`, 0, -1, (err, reply) => {
      callback(reply);
    });
  }
}

module.exports = TokenStorage;