var eve = require('eve'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

function HatchClient(id, options) {
    var opts = options || {};

    if (! (this instanceof HatchClient)) {
        return new HatchClient(id, options);
    }

    this.id = id;
    this.source = new EventSource((opts.server || '/__hatch') + this.id);

    // handle messages
    this.source.addEventListener('message', this._handleMessage.bind(this));
}

util.inherits(HatchClient, EventEmitter);
module.exports = HatchClient;

/**
## _handleMessage
*/
HatchClient.prototype._handleMessage = function(evt) {
    var data;

    try {
        data = JSON.parse(evt.data);

        // emit the event
        this.emit.apply(this, [data.name].concat(data.args));
    }
    catch (e) {
    }
};
