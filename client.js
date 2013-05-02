var eve = require('eve'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

function HatchClient() {
}

util.inherits(HatchClient, EventEmitter);

