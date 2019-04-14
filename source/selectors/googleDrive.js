const STATE_KEY = "googleDrive";

export function getGoogleDriveToken(state) {
    return state[STATE_KEY].authToken;
}

export function isGoogleDriveAuthenticated(state) {
    return state[STATE_KEY].authenticated;
}

export function isGoogleDriveAuthenticating(state) {
    return state[STATE_KEY].authenticating;
}
