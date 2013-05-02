var debug = require('debug')('hatch'),
    eve = require('eve');

function hatch(server, options) {
    var h = new EventHatch(server, options);

    debug('binding hatch to server, looking for urls matching pattern: ' + h.baseUrl);
    server.on('request', EventHatch.prototype._handleRequest.bind(h));    

    return h;
}

hatch.waitFor = function(id, callback) {
    eve.once(['hatch', id, 'ready'].join('.'), callback);
};

module.exports = hatch;

/* EventHatch implementaton */

function EventHatch(server, options) {
    var opts = options || {};

    // initialise the default base url
    this.baseUrl = opts.baseUrl || '/__hatch';

    // initialise the heartbeat interval (in seconds)
    this.heartbeatInterval = opts.heartbeatInterval || 15;
}

/**
## _handleRequest
*/
EventHatch.prototype._handleRequest = function(req, res) {
    var hatchInstance = this,
        hbInterval,
        requestId;

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
        eve(['hatch', requestId, 'ready'].join('.'), hatchInstance);

        // keep the connection alive
        if (hatchInstance.heartbeatInterval) {
            hbInterval = setInterval(function() {
                res.write(':hb\n');
            }, hatchInstance.heartbeatInterval * 1000);
        }
    });

    // listen for events matching the request id
    eve.on('hatch.' + requestId, streamEvent);

    // when the response is closed, unbind the handler
    res.on('close', function() {
        debug('unbinding event listener for request id: ' + requestId);
        eve.unbind('hatch.' + requestId, streamEvent);
        clearInterval(hbInterval);
    });

    // send the response
    res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive'
    });

    res.write('\n');
};