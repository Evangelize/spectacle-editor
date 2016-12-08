import EventEmitter from "eventemitter3";

export default class Socket extends EventEmitter {
  connected = false;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.connected = true;
    this.emit("open");
  }

  message(event) {
    this.emit("message", event);
  }

  send(payload) {
    if (this.connected) {
      this.emit("send", payload);
    }
  }
}
