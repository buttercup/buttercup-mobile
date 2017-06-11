const STATE_KEY = "archives";

export function getArchivesDisplayList(state) {
    const archivesArray = state[STATE_KEY].archives;
    return [...archivesArray];
}
