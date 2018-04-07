const STATE_KEY = "archives";

export function getArchivesDisplayList(state) {
    return state[STATE_KEY].archives;
}

export function getSourceIDsUsingTouchID(state) {
    return state[STATE_KEY].archivesUsingTouchID;
}

export function isUnlocking(state) {
    return state[STATE_KEY].isUnlockingSelected;
}

export function shouldShowUnlockPasswordPrompt(state) {
    return state[STATE_KEY].showUnlockPasswordPrompt;
}
