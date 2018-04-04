const NOOP = () => {};

let __globalNotification = NOOP;

export function executeNotification(type, title, message) {
    __globalNotification(type, title, message);
}

export function setNotificationFunction(fn) {
    __globalNotification = fn || NOOP;
}
