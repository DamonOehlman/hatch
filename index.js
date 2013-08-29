/* jshint node: true */
'use strict';

var eve = require('eve');
var EventChannel = require('./channel');

/**
  # hatch

  Provide feedback to your client pages using hatch.  Hatch uses
  [eve](https://github.com/adobe-web-platform/eve) to capture and route
  events in a server process to the client using unique request ids.

  ## Reference

**/


/**
  ### hatch(server, opts?)

  Connect a `request` listener to the target server that will (by default)
  intercept requests for `/__hatch` and route appropriate `eve` events
  to the server-sent event stream.

**/
var hatch = module.exports = function(server, opts) {
  var baseUrl = (opts || {}).baseUrl || '/__hatch';
  var heartbeatInterval = (opts || {}).heartbeatInterval || 15;

  function handleRequest(req, res) {
    var channel;
    var hbInterval;
    var requestId;

    function cleanup() {
      eve.unbind('hatch.' + requestId, streamEvent);
      clearInterval(hbInterval);
    }

    function streamEvent() {
      var evtName = eve.nt();
      var data = {
        name: evtName.split('.').slice(2).join('.'),
        args: [].slice.call(arguments)
      };

      res.write('data: ' + JSON.stringify(data) + '\n\n');
    }

    // if we don't have a hatch url, abort
    if (req.url.indexOf(baseUrl) !== 0) return;

    // get the request id
    requestId = req.url.slice(baseUrl.length);

    // create the channel
    channel = new EventChannel(requestId);

    // add a close handler
    channel.close = function() {
      cleanup();
      res.end();
    };

    // emit the ready event for this request id
    process.nextTick(function() {
      eve('hatch.ready.' + requestId, channel);

      // keep the connection alive
      if (heartbeatInterval) {
        hbInterval = setInterval(function() {
          res.write(':hb\n');
        }, heartbeatInterval * 1000);
      }
    });

    // listen for events matching the request id
    eve.on('hatch.' + requestId, streamEvent);

    // when the response is closed, unbind the handler
    res.on('end', cleanup);
    res.on('close', cleanup);
    // req.on('close', cleanup);

    // send the response
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    });

    res.write('\n');
  }

  server.on('request', handleRequest);

  // pass through the server
  return server;
}


/**
  ### hatch.waitFor(id, callback)

  Wait for the specified hatch to be opened.
**/
hatch.waitFor = function(id, callback) {
  eve.once('hatch.ready.' + id, callback);
};