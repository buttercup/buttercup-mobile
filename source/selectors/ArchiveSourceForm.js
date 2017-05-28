const STATE_KEY = "addArchive";

export function getArchiveType(state) {
    return state[STATE_KEY].archiveType;
}
