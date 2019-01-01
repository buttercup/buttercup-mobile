const STATE_KEY = "app";

export function getBusyState(state) {
    return state[STATE_KEY].busyState;
}

export function getSearchContext(state) {
    return state[STATE_KEY].searchContext;
}
