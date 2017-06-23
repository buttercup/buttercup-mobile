const STATE_KEY = "archiveContents";
const ARCHIVES_STATE_KEY = "archives";

export function getGroups(state) {
    return state[STATE_KEY].groups;
}

export function getSelectedGroupID(state) {
    return state[STATE_KEY].selectedGroupID;
}

export function getSelectedSourceName(state) {
    const selected = getSelectedSource(state);
    return selected && selected.name || "";
}

export function getSelectedSource(state) {
    const id = getSelectedSourceID(state);
    return state[ARCHIVES_STATE_KEY].archives.find(source => source.id === id);
}

export function getSelectedSourceID(state) {
    return state[STATE_KEY].selectedSourceID;
}
