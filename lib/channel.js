var eve = require('eve');

function EventChannel(hatch, id) {
    // initialise
    this.hatch = hatch;
    this.id = id;

    // set the base args for the events
    this.baseArgs = ['hatch', id];
}

module.exports = EventChannel;

/**
## emit(name)

Emit the event
*/
EventChannel.prototype.emit = function(name) {
    var extraArgs = Array.prototype.slice.call(arguments, 1);

    // preped the base namespace to the event name
    name = this.baseArgs.concat(name.split('.')).join('.');

    eve.apply(eve, [name, this].concat(extraArgs));
};