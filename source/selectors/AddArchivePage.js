const STATE_KEY = "addArchive";

export function getAdditionStage(state) {
    // if (state[STATE_KEY].connection === "connected") {
    //     return "chooseFile";
    // } else
    if (state[STATE_KEY].archiveType !== null) {
        return "enterConnectionDetails";
    }
    return "chooseType";
};
