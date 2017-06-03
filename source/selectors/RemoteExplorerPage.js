const STATE_KEY = "remoteExplorer";

export function getCurrentItems(state) {
    return state[STATE_KEY].items;
}

export function getCurrentPath(state) {
    return state[STATE_KEY].remotePath;
}

export function isLoading(state) {
    return state[STATE_KEY].loading;
}
