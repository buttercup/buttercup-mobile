const STATE_KEY = "googleDrive";

export function getAuthCode(state) {
    return state[STATE_KEY].authCode;
}

export function getAuthToken(state) {
    return state[STATE_KEY].authToken;
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
