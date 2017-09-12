const STATE_KEY = "dropbox";

export function getNotification(state) {
    return state[STATE_KEY].notification;
}

export function getToken(state) {
    return state[STATE_KEY].authToken;
}

export function isAuthenticated(state) {
    return state[STATE_KEY].authenticated;
}

export function isAuthenticating(state) {
    return state[STATE_KEY].authenticating;
}
