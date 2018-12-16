import { EventChannel } from './channel';
import * as eve from 'eve';
import { ServerResponse, Server } from 'http';
import * as debugModule from 'debug';

const debug = debugModule('foo');

interface HatchOpts {
  baseUrl?: string;
  heartbeatInterval?: number;
}

const DEFAULT_OPTS = {
  baseUrl: '__hatch',
  heartbeatInterval: 15,
};

export const hatch = (server: Server, opts?: HatchOpts) => {
  const baseUrl = withDefaults(opts).baseUrl;
  const heartbeatInterval = withDefaults(opts).heartbeatInterval;
  const reHatchUrl = new RegExp(`/?${baseUrl}(.*)$`);

  function handleRequest(req: Request, res: ServerResponse) {
    let hbInterval: NodeJS.Timeout | undefined;

    function cleanup() {
      eve.unbind('hatch.' + requestId, streamEvent);
      hbInterval && clearInterval(hbInterval);
    }

    function streamEvent() {
      var evtName = eve.nt();
      var data = {
        name: evtName.split('.').slice(2).join('.'),
        args: [].slice.call(arguments)
      };

      res.write('data: ' + JSON.stringify(data) + '\n\n');
    }

    const hatchMatch = reHatchUrl.exec(req.url);
    if (!hatchMatch) {
      return;
    }

    const requestId = hatchMatch[1];
    const channel = new EventChannel(requestId, {
      onClose: () => {
        cleanup();
        res.end();
      }
    });

    // emit the ready event for this request id
    process.nextTick(() => {
      eve('hatch.ready.' + requestId, channel);
      if (heartbeatInterval) {
        hbInterval = setInterval(() => res.write(':hb\n'), heartbeatInterval * 1000);
      }
    });

    // listen for events matching the request id
    eve.on('hatch.' + requestId, streamEvent);
    res.on('end', cleanup);
    res.on('close', cleanup);

    // send the response
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    });

    res.write('\n');
  }

  server.on('request', handleRequest);
  return server;
}

export const waitFor = (id: string, callback: (this: EventChannel) => void) => {
  eve.once(`hatch.ready.${id}`, callback);
};

function withDefaults(opts?: HatchOpts) {
  return {
    ...DEFAULT_OPTS,
    ...opts,
  };
}
