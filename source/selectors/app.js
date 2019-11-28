const STATE_KEY = "app";

export function getBusyState(state) {
    return state[STATE_KEY].busyState;
}

export function getPendingOTPURL(state) {
    return state[STATE_KEY].pendingOTPURL;
}

export function getSearchContext(state) {
    return state[STATE_KEY].searchContext;
}
