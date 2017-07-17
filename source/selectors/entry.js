const STATE_KEY = "entry";

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

export function getNotification(state) {
    return state[STATE_KEY].notification;
}
