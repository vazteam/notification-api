"use strict";

const redis = require('redis');

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

    this.redis.get(`token:${token}`, (err, reply) => {
      var multi = this.redis.multi();

      if (reply !== null) {
        multi.lrem(`id:${reply}`, 0, token);
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

  getAllTokens (callback) {
    this.redis.keys(`token:*`, (err, reply) => {
      var tokens = reply.map((key) => {
        return key.replace('token:', '');
      });
      callback(tokens);
    });
  }
}

module.exports = TokenStorage;
