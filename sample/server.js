var eve = require('eve');
var hatch = require('..');
var http = require('http');
var corser = require('corser');
var server = hatch(http.createServer(corser.create()));

// respond to clients connecting to the event streams the eve way
eve.on('hatch.ready', function() {
  var requestId = eve.nt().split('.')[2];

  // send a random event
  eve('hatch.' + requestId + '.hello');
});

server.listen(3000);