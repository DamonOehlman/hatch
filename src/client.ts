import { EventEmitter } from 'events';

export class HatchClient extends EventEmitter {
  constructor(private readonly id: string, private readonly source: EventSource) {
    super();
    source.onmessage = (evt) => this.handleMessage(evt);
  }

  private handleMessage(evt: MessageEvent) {
    try {
      const data = JSON.parse(evt.data);
      this.emit(data.name, ...data.args);
    }
    catch (e) {
    }
  }
}
