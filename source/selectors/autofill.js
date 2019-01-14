const STATE_KEY = "autofill";

export function getIsContextAutoFill(state) {
    return state[STATE_KEY].isContextAutoFill;
}

export function getAutoFillURLs(state) {
    return state[STATE_KEY].urls;
}

export function getAutoFillIdentity(state) {
    return state[STATE_KEY].identity;
}
