const STATE_KEY = "app";

export function getBusyState(state) {
    return state[STATE_KEY].busyState;
}
