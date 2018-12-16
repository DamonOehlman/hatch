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

// function EventChannel(id) {
//   if (! (this instanceof EventChannel)) {
//     return new EventChannel(id);
//   }

//   this.id = id;
//   this.baseArgs = ['hatch', id];
// }

// module.exports = EventChannel;

// EventChannel.prototype.emit = function(name) {
//   var extraArgs = [].slice.call(arguments, 1);

//   // preped the base namespace to the event name
//   name = this.baseArgs.concat(name.split('.')).join('.');

//   // trigger the eve event
//   eve.apply(eve, [name, this].concat(extraArgs));
// };
