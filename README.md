# hatch

Provide feedback to your client pages using hatch.  Hatch uses
[eve](https://github.com/adobe-web-platform/eve) to capture and route
events in a server process to the client using unique request ids.


[![NPM](https://nodei.co/npm/hatch.png)](https://nodei.co/npm/hatch/)

[![Build Status](https://travis-ci.org/DamonOehlman/hatch.png?branch=master)](https://travis-ci.org/DamonOehlman/hatch)

## Reference

### hatch(server, opts?)

Connect a `request` listener to the target server that will (by default)
intercept requests for `/__hatch` and route appropriate `eve` events
to the server-sent event stream.

### hatch.waitFor(id, callback)

Wait for the specified hatch to be opened.

### EventChannel(id)

Create a new EventChannel instance

### EventChannel#emit(name, args*)

Emit the event

### HatchClient(id, options)

### HatchClient#handleMessage(evt)

## License(s)

### MIT

Copyright (c) 2013 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
