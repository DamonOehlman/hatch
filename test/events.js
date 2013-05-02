var hatch = require('..'),
    http = require('http'),
    test = require('tape'),
    eve = require('eve'),
    server = http.createServer(),
    uuid = require('uuid'),
    request = require('hyperquest');

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

            eve.once(['hatch', id, 'ready'].join('.'), function() {
                t.pass('received hatch.' + id + '.ready');
            });

            request('http://localhost:3000/__hatch' + id);
        });

        t.test('you can wait for a hatch', function(t) {
            id = uuid();
            t.plan(2);

            hatch.waitFor(id, function() {
                t.pass('hatch ' + id + ' ready');
                t.equal(typeof this.emit, 'function', 'hatch provides an emit method');
            });

            request('http://localhost:3000/__hatch' + id);
        });

        t.test('waited for hatch instances emit events for the appropriate request id', function(t) {
            id = uuid();
            t.plan(3);

            hatch.waitFor(id, function() {
                t.equal(typeof this.emit, 'function', 'hatch provides an emit method');

                // emit the foo event
                this.emit('foo', 'bar');
            });

            eve.once('hatch.' + id + '.foo', function(value) {
                t.equal(this.id, id, 'hatch emitted event with the appropriate id');
                t.equal(value, 'bar', 'event passed through value succesfully');
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

        t.test('can close the server', function(t) {
            server.close();
            t.end();
        });
    });
});