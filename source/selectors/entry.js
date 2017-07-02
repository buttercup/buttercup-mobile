const STATE_KEY = "entry";

export function getEntryTitle(state) {
    return state[STATE_KEY].properties.title;
}
