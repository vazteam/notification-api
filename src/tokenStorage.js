"use strict";

const redis = require('redis');

class TokenStorage {
  constructor(config) {
    this.redis = redis.createClient();
    this.config = config || {};

    // Redis のキーにつく Prefix (`dev-` であれば `dev-id` のようなキーが生成される)
    this.redisPrefix = this.config.redisPrefix || '';

    // Register 処理をする際のロック    
    this.registerLock = false;
  }

  registerToken (id, token) {
    var timerId = setInterval(() => {
      if (this.registerLock === false) {
        this.registerLock = true;
        clearInterval(timerId);
      }
    }, 50);

    this.redis.get(`${this.redisPrefix}token:${token}`, (err, reply) => {
      var multi = this.redis.multi();

      if (reply !== null) {
        multi.lrem(`${this.redisPrefix}id:${reply}`, 0, token);
      }

      multi.lpush(`${this.redisPrefix}id:${id}`, token);
      multi.set(`${this.redisPrefix}token:${token}`, id);

      multi.exec();
    });

    this.registerLock = false;
  }

  getTokensById (id, callback) {
    this.redis.lrange(`${this.redisPrefix}id:${id}`, 0, -1, (err, reply) => {
      callback(reply);
    });
  }

  getAllTokens (callback) {
    this.redis.keys(`${this.redisPrefix}token:*`, (err, reply) => {
      var tokens = reply.map((key) => {
        return key.replace(`${this.redisPrefix}token:`, '');
      });
      callback(tokens);
    });
  }
}

module.exports = TokenStorage;
