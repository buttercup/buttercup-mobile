const STATE_KEY = "browser";

export function getURL(state) {
    return state[STATE_KEY].url;
}
