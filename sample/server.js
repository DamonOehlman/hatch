var eve = require('eve'),
    hatch = require('..'),
    http = require('http'),
    corser = require('corser'),
    server = http.createServer(corser.create());

// attach the hatch
hatch(server);

// respond to clients connecting to the event streams the eve way
eve.on('hatch.*.ready', function() {
    var requestId = eve.nt().split('.')[1];

    // send a random event
    eve('hatch.' + requestId + '.hello');
});

server.listen(3000);