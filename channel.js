var eve = require('eve');

function EventChannel(id) {
  if (! (this instanceof EventChannel)) {
    return new EventChannel(id);
  }

  this.id = id;
  this.baseArgs = ['hatch', id];
}

module.exports = EventChannel;

EventChannel.prototype.emit = function(name) {
  var extraArgs = [].slice.call(arguments, 1);

  // preped the base namespace to the event name
  name = this.baseArgs.concat(name.split('.')).join('.');

  // trigger the eve event
  eve.apply(eve, [name, this].concat(extraArgs));
};
