var hatch = require('../client'),
    uuid = require('uuid');

hatch(uuid(), { server: 'http://localhost:3000/__hatch' })
    .on('ready', function() {
        console.log('ready');
    })
    .on('hello', function() {
        console.log('hello');
    });