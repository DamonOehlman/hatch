const { hatch } = require('..');
const http = require('http');
const test = require('tape');
const server = http.createServer();
const uuid = require('uuid');
const request = require('hyperquest');
const app = 'http://localhost:3000';
const id = uuid.v4();

test('can bind hatch to the server', function(t) {
  t.plan(1);
  t.ok(hatch(server, { heartbeatInterval: 2 }), 'bound');
});

test('can have the server listen to the test port', function(t) {
  t.plan(1);
  server.listen(3000, t.pass.bind(t, 'ready'));
});

test('content-type is a text/event-stream', function(t) {
  t.plan(2);
  const req = request('http://localhost:3000/__hatch' + id);
  req.on('response', function(res) {
    t.equal(res.statusCode, 200, 'status code === 200');
    t.equal(res.headers['content-type'], 'text/event-stream', 'content-type === text/event-stream');

    // force the socket closed
    res.socket.end();
  });

  req.on('error', function(err) {
    t.fail(err);
  });
});

test('heartbeat check', function(t) {
  t.plan(1);
  const req = request('http://localhost:3000/__hatch' + uuid());
  req.on('response', function(res) {
    res.on('data', function(data) {
      data = data.toString();

      if (data && data[0] === ':') {
        t.pass('found heartbeat comment');
        res.socket.end();
      }
    });
  });
});

test('can close the server', function(t) {
  t.plan(1);
  t.ok(server.close(), 'finished');
});
