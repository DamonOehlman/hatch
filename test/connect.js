var hatch = require('..'),
    http = require('http'),
    test = require('tape'),
    server = http.createServer(),
    uuid = require('uuid'),
    request = require('hyperquest'),
    app = 'http://localhost:3000';

test('connection tests', function(t) {

    // create the hatch
    var h = hatch(server),
        id = uuid();

    server.listen(3000, function() {

        // ensure we have a hatch
        t.plan(1);
        t.ok(h, 'Hatch created and bound to the server correctly');

        t.test('content-type is a text/event-stream', function(t) {
            var req = request('http://localhost:3000/__hatch' + id);

            t.plan(2);

            req.on('response', function(res) {
                t.equal(res.statusCode, 200, 'Did not get a 200OK');
                t.equal(res.headers['content-type'], 'text/event-stream', 'Did not provide an event-stream');
            });

            req.on('error', function(err) {
                t.fail(err);
            });
        });

        t.test('can close the server', function(t) {
            server.close();
            t.end();
        });
    });
});