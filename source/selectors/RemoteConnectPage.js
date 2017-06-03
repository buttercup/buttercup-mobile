const STATE_KEY = "addArchive";

export function getArchiveType(state) {
    return state[STATE_KEY].archiveType;
}

export function getRemoteConnectionInfo(state) {
    const { archiveType, remoteUsername, remotePassword, remoteURL } = state[STATE_KEY];
    return {
        archiveType,
        remoteUsername,
        remotePassword,
        remoteURL
    };
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

export function isConnecting(state) {
    return state[STATE_KEY].connection === "connecting";
}
