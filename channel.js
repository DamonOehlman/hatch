/* jshint node: true */
'use strict';

var eve = require('eve');

/**
  ### EventChannel(id)

  Create a new EventChannel instance
**/
function EventChannel(id) {
  if (! (this instanceof EventChannel)) {
    return new EventChannel(id);
  }

  // initialise
  this.id = id;

  // set the base args for the events
  this.baseArgs = ['hatch', id];
}

module.exports = EventChannel;

/**
  ### EventChannel#emit(name, args*)

  Emit the event
**/
EventChannel.prototype.emit = function(name) {
  var extraArgs = [].slice.call(arguments, 1);

  // preped the base namespace to the event name
  name = this.baseArgs.concat(name.split('.')).join('.');

  // trigger the eve event
  eve.apply(eve, [name, this].concat(extraArgs));
};