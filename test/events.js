var hatch = require('..'),
    http = require('http'),
    test = require('tape'),
    eve = require('eve'),
    server = http.createServer(),
    uuid = require('uuid'),
    request = require('hyperquest'),
    app = 'http://localhost:3000';

test('event tests', function(t) {

    // create the hatch
    var h = hatch(server), id, req;

    server.listen(3000, function() {

        // ensure we have a hatch
        t.plan(1);
        t.ok(h, 'Hatch created and bound to the server correctly');

        t.test('connecting to the eventstream triggers a hatch.%id%.ready event', function(t) {
            id = uuid();
            t.plan(1);

            eve.on(['hatch', id, 'ready'].join('.'), function() {
                t.pass('event captured');
            });

            request('http://localhost:3000/__hatch' + id);
        });

        t.test('eve events are routed to the event stream', function(t) {
            id = uuid();

            t.plan(1);

            req = request('http://localhost:3000/__hatch' + id)
            req.once('response', function(res) {
                // look for response data
                res.on('data', function(data) {
                    try {
                        data = JSON.parse(data.toString().slice(5));

                        if (data.name === 'foo') {
                            t.pass('foo event captured');
                        }
                    }
                    catch (e) {
                    }
                });
            });

            req.on('error', function(err) {
                t.fail(err);
            });

            eve.once(['hatch', id, 'ready'].join('.'), function() {
                eve('hatch.' + id + '.foo', null, 'bar');
            });

        });
    });
});