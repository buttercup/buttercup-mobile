import isOnline from "is-online";

export function getConnectedStatus() {
    return isOnline();
}
