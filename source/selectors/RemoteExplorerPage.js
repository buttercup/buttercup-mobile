const STATE_KEY = "remoteExplorer";

export function getCurrentItems(state) {
    return state[STATE_KEY].items;
}

export function getCurrentPath(state) {
    return state[STATE_KEY].remotePath;
}

export function getNewArchiveDetails(state) {
    const {
        newPromptArchiveName: archiveName,
        newPromptPassword: archivePassword,
        selectedArchivePath: archivePath,
    } = state[STATE_KEY];
    return {
        archiveName,
        archivePassword,
        archivePath
    };
}

export function getNewFilename(state) {
    return state[STATE_KEY].newPromptFilename;
}

export function getNewPassword(state) {
    return state[STATE_KEY].newPromptPassword;
}

export function isAddingArchive(state) {
    return state[STATE_KEY].adding;
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

export function shouldShowNewNamePrompt(state) {
    return state[STATE_KEY].showNewNamePrompt;
}

export function shouldShowPasswordPrompt(state) {
    return state[STATE_KEY].showNewPasswordPrompt;
}

export function willCreateNewArchive(state) {
    return state[STATE_KEY].createNew;
}
