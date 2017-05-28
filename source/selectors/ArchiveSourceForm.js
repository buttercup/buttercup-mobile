const STATE_KEY = "addArchive";

export function getArchiveType(state) {
    return state[STATE_KEY].archiveType;
}

export function getRemoteCredentials(state) {
    const {
        remoteUsername: username,
        remotePassword: password
    } = state[STATE_KEY];
    return { username, password };
}

export function getRemoteURL(state) {
    return state[STATE_KEY].remoteURL;
}
