const STATE_KEY = "dropbox";

export function isAuthenticated(state) {
    return state[STATE_KEY].authenticated;
}

export function isAuthenticating(state) {
    return state[STATE_KEY].authenticating;
}
