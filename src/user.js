"use strict";

const TokenStorage = require("./tokenStorage.js");

class User {
    constructor() {
        this.id = id;
        this.tokenStorage = new TokenStorage({
            redisPrefix: ''
        });
    }

    notify(token) {
        this.tokenStorage.register(this.id, this.token);
    }

    getBadgeCount() {

    }
    
    resetBadgeCount() {
        
    }
}

module.exports = User;