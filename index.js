var debug = require('debug')('hatch'),
    eve = require('eve');

function EventHatch(server, options) {
    var opts = options || {};

    if (! (this instanceof EventHatch)) {
        return new EventHatch(server, opts);
    }

    // initialise the default base url
    this.baseUrl = opts.baseUrl || '/__hatch';

    debug('binding hatch to server, looking for urls matching pattern: ' + this.baseUrl);
    server.on('request', this._handleRequest.bind(this));    
}

module.exports = EventHatch;

/**
## _handleRequest
*/
EventHatch.prototype._handleRequest = function(req, res) {
    var requestId;

    function streamEvent() {
        var evtName = eve.nt(),
            data = {
                name: evtName.split('.').slice(2).join('.'),
                args: [].slice.call(arguments)
            };

        debug('received event: ' + evtName, arguments);
        res.write('data: ' + JSON.stringify(data) + '\n\n');
    }

    // if we don't have a hatch url, abort
    if (req.url.indexOf(this.baseUrl) !== 0) return;

    // get the request id
    requestId = req.url.slice(this.baseUrl.length);
    debug('received hatch request for request id: ' + requestId);

    // emit the ready event for this request id
    process.nextTick(function() {
        eve(['hatch', requestId, 'ready'].join('.'));
    });

    // listen for events matching the request id
    eve.on('hatch.' + requestId, streamEvent);

    // when the response is closed, unbind the handler
    res.on('close', function() {
        debug('unbinding event listener for request id: ' + requestId);
        eve.unbind('hatch.' + requestId, streamEvent);
    });

    // send the response
    res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive'
    });

    res.write('\n');
};