const STATE_KEY = "myButtercup";

export function getAccessToken(state) {
    return state[STATE_KEY].accessToken;
}

export function getRefreshToken(state) {
    return state[STATE_KEY].refreshToken;
}

export function isAuthenticated(state) {
    return state[STATE_KEY].authenticated;
}

export function isAuthenticating(state) {
    return state[STATE_KEY].authenticating;
}
