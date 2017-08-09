const STATE_KEY = "entry";

export function getEntryFields(state) {
    return state[STATE_KEY].fields;
}

export function getEntryID(state) {
    return state[STATE_KEY].id;
}

export function getEntryMeta(state) {
    return getEntryFields(state).filter(f => f.field === "meta");
}

export function getEntryPassword(state) {
    const passwordField = getEntryProperties(state).find(item => item.property === "password");
    return passwordField && passwordField.value || "";
}

export function getEntryProperties(state) {
    return getEntryFields(state).filter(f => f.field === "property");
}

export function getEntryTitle(state) {
    const titleField = getEntryProperties(state).find(item => item.property === "title");
    return titleField && titleField.value || "";
}

export function getEntryURL(state) {
    const urlField = getEntryMeta(state).find(item => /url/i.test(item.property));
    return urlField && urlField.value || null;
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

export function isEditing(state) {
    return state[STATE_KEY].editing;
}

export function isSaving(state) {
    return state[STATE_KEY].saving;
}
