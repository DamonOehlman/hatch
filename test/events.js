var eve = require('eve');
var hatch = require('..');
var http = require('http');
var test = require('tape');
var server = http.createServer();
var uuid = require('uuid');
var request = require('hyperquest');
var app = 'http://localhost:3000';
var id = uuid.v4();

test('can bind hatch to the server', function(t) {
  t.plan(1);
  t.ok(hatch(server), 'bound');
});

test('can have the server listen to the test port', function(t) {
  t.plan(1);
  server.listen(3000, t.pass.bind(t, 'ready'));
});

test('connecting to the eventstream triggers a hatch.%id%.ready event', function(t) {
  id = uuid();

  t.plan(1);
  eve.once('hatch.ready', function() {
    t.equal(eve.nt().split('.')[2], id, 'got id match');
    process.nextTick(this.close);
  });

  request('http://localhost:3000/__hatch' + id);
});

test('you can wait for a hatch', function(t) {
  id = uuid();
  t.plan(2);

  hatch.waitFor(id, function() {
    t.pass('hatch ' + id + ' ready');
    t.equal(typeof this.emit, 'function', 'hatch provides an emit method');
    process.nextTick(this.close);
  });

  request('http://localhost:3000/__hatch' + id);
});

test('waited for hatch instances emit events for the appropriate request id', function(t) {
  id = uuid();
  t.plan(3);

  hatch.waitFor(id, function() {
    t.equal(typeof this.emit, 'function', 'hatch provides an emit method');

    // emit the foo event
    this.emit('foo', 'bar');
    process.nextTick(this.close);
  });

  eve.once('hatch.' + id + '.foo', function(value) {
    t.equal(this.id, id, 'hatch emitted event with the appropriate id');
    t.equal(value, 'bar', 'event passed through value succesfully');
  });

  request('http://localhost:3000/__hatch' + id);
});

test('eve events are routed to the event stream', function(t) {
  var req;
  var buffer = '';

  id = uuid();
  t.plan(2);

  req = request('http://localhost:3000/__hatch' + id);
  req.once('response', function(res) {
    // look for response data
    res.on('data', function handleData(data) {
      buffer += data.toString();

      if (buffer.indexOf('}') >= 0) {
        try {
          data = JSON.parse(data.toString().slice(5));

          if (data.name === 'foo') {
            t.pass('foo event captured');
            res.removeListener('data', handleData);
            res.socket.end();
          }
        }
        catch (e) {
          t.fail('errored out', e);
        }
      }
    });
  });

  req.on('error', function(err) {
    t.fail(err);
  });

  hatch.waitFor(id, function() {
    t.pass('hatch ready, sending event');
    eve('hatch.' + id + '.foo', null, 'bar');
  });
});

test('can close the server', function(t) {
  t.plan(1);
  t.ok(server.close(), 'finished');
});