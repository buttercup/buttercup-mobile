const STATE_KEY = "entry";

export function getEntryProperties(state) {
    return state[STATE_KEY].properties;
}

export function getEntryTitle(state) {
    return getEntryProperties(state).title;
}

export function getMetaItems(state) {
    return state[STATE_KEY].meta || {};
}

export function getNotification(state) {
    return state[STATE_KEY].notification;
}
