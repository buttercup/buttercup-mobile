const NOOP = () => {};

let __globalNotification = NOOP;

export function executeNotification(type, title, message, timeOverride = null) {
    __globalNotification(type, title, message, timeOverride);
}

export function setNotificationFunction(fn) {
    __globalNotification = fn || NOOP;
}
