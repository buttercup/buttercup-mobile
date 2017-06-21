const STATE_KEY = "archiveContents";

export function getGroups(state) {
    return state[STATE_KEY].groups;
}

export function getSelectedGroupID(state) {
    return state[STATE_KEY].selectedGroupID;
}

export function getSelectedSourceID(state) {
    return state[STATE_KEY].selectedSourceID;
}
