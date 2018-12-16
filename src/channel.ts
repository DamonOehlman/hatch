import * as eve from 'eve';

interface ChannelHandlers {
  onClose: () => void;
}

export class EventChannel {
  private readonly baseArgs: string[];

  constructor(private readonly id: string, private readonly handlers: ChannelHandlers) {
    this.baseArgs = ['hatch', id];
  }

  public emit(inputName: string, ...values: any[]) {
    const name = [...this.baseArgs, inputName.split('.')].join('.');
    eve(name, this, ...values);
  }

  public close() {
    this.handlers.onClose();
  }
}
