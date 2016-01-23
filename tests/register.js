"use strict";

var TokenStorage = require('../src/tokenStorage.js');
var ts = new TokenStorage();

ts.registerToken('1', 'fc749644c85116c134f539cf0254a1680a48bb70ece5fcd88b9cb79cc74fd0ba');
// ts.registerToken('2', 'ffff47e528dc484dabf4262bd3199cb8d608d0ad486c0214f0a93347799a51d6');

setTimeout(() => {
  ts.getTokensById('1', (tokens) => {
    console.log(tokens);
  });


  ts.getTokensById('2', (tokens) => {
    console.log(tokens);
  });

  ts.getAllTokens((tokens) => {
    console.log(tokens);
  });
}, 3000);