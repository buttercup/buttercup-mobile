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

export function getNewParentID(state) {
    return state[STATE_KEY].newEntry.parentID;
}

export function getNewPassword(state) {
    return state[STATE_KEY].newEntry.password;
}

export function getNewTitle(state) {
    return state[STATE_KEY].newEntry.title;
}

export function getNewUsername(state) {
    return state[STATE_KEY].newEntry.username;
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
