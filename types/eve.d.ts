declare namespace eve {
  type EveHandler = (...values: any[]) => any;
  type EvePrioritizer = (zIndex: number) => void;

  interface Eve {
    (name: string, ...values: any[]): [];
    on(name: string, handler: EveHandler): EvePrioritizer;
    once(name: string, handler: EveHandler): EvePrioritizer;
    off(name: string, handler: EveHandler): void;
    unbind(name: string, handler: EveHandler): void;

    // only valid within an event handler
    nt(subname?: string): string;
    nts(): string[];
    stop(): void;
  }
}

declare module 'eve' {
  var eve: eve.Eve;
  export = eve;
}
