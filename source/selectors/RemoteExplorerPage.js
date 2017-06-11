const STATE_KEY = "remoteExplorer";

export function getCurrentItems(state) {
    return state[STATE_KEY].items;
}

export function getCurrentPath(state) {
    return state[STATE_KEY].remotePath;
}

export function getNewFilename(state) {
    return state[STATE_KEY].newPromptFilename;
}

export function getNewPassword(state) {
    return state[STATE_KEY].newPromptPassword;
}

export function isCreatingFile(state) {
    return state[STATE_KEY].creatingFile;
}

export function isLoading(state) {
    return state[STATE_KEY].loading;
}

export function shouldShowNewFilePrompt(state) {
    return state[STATE_KEY].showNewPrompt;
}

export function shouldShowPasswordPrompt(state) {
    return state[STATE_KEY].showNewPasswordPrompt;
}
