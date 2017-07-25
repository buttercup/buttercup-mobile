const STATE_KEY = "entry";

export function getEntryID(state) {
    return state[STATE_KEY].id;
}

export function getEntryProperties(state) {
    return state[STATE_KEY].properties;
}

export function getEntryTitle(state) {
    const titleField = getEntryProperties(state).find(item => item.property === "title");
    return titleField && titleField.value || "";
}

export function getMetaItems(state) {
    return state[STATE_KEY].meta || [];
}

export function getNewMetaKey(state) {
    const newMeta = state[STATE_KEY].newMeta || {};
    return newMeta.key || "";
}

export function getNewMetaValue(state) {
    const newMeta = state[STATE_KEY].newMeta || {};
    return newMeta.value || "";
}

export function getNotification(state) {
    return state[STATE_KEY].notification;
}

export function getSourceID(state) {
    return state[STATE_KEY].sourceID;
}
