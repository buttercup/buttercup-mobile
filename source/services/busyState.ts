import EventEmitter from "eventemitter3";

let __emitter: EventEmitter = null,
    __busyMessage: string = null;

export function getBusyState(): string {
    return __busyMessage;
}

export function getEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}

export function setBusyState(message: string) {
    __busyMessage = message;
    getEmitter().emit("change", __busyMessage);
}
