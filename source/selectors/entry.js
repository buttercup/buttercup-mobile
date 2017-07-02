const STATE_KEY = "entry";

export function getEntryProperties(state) {
    return state[STATE_KEY].properties;
}

export function getEntryTitle(state) {
    return getEntryProperties(state).title;
}
