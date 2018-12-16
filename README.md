
# hatch

Provide feedback to your client pages using hatch.  Hatch uses
[eve](https://github.com/adobe-web-platform/eve) to capture and route
events in a server process to the client using unique request ids.


[![NPM](https://nodei.co/npm/hatch.png)](https://nodei.co/npm/hatch/)

[![Build Status](https://api.travis-ci.org/DamonOehlman/hatch.svg?branch=master)](https://travis-ci.org/DamonOehlman/hatch) [![bitHound Score](https://www.bithound.io/bitbucket/DamonOehlman/hatch/badges/score.svg)](https://www.bithound.io/bitbucket/DamonOehlman/hatch)

## Reference

### hatch(server, opts?)

Connect a `request` listener to the target server that will (by default)
intercept requests for `/__hatch` and route appropriate `eve` events
to the server-sent event stream.

### hatch.waitFor(id, callback)

Wait for the specified hatch to be opened.

## LICENSE
