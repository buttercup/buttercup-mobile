const STATE_KEY = "archives";

export function getArchivesDisplayList(state) {
    return state[STATE_KEY].archives;
}
