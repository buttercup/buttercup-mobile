import { getSharedArchiveManager } from "../library/buttercup.js";
import { rawGroupIsTrash } from "../shared/group.js";

const STATE_KEY = "archiveContents";
const ARCHIVES_STATE_KEY = "archives";

function getEntries(state) {
    return state[STATE_KEY].entries;
}

// Get the id, title, entries and subgroups of a group for the specified group id.
// If the given id is "0" the base level of the archive is returned. In this case the list of entries is always empty.
export function getGroup(state, id, _groups = null) {
    const allGroups = _groups || getGroups(state);
    const allEntries = getEntries(state);
    if (id === "0") {
        const groups = allGroups.filter(group => group.parentID === id) || [];
        return {
            id: "0",
            title: "[archive]",
            groups: sortGroups(groups),
            entries: []
        };
    }
    const targetGroup = allGroups.find(group => group.id === id);
    if (targetGroup) {
        const entries = allEntries.filter(entry => entry.parentID === targetGroup.id);
        const groups = allGroups.filter(group => group.parentID === targetGroup.id) || [];
        return {
            id,
            title: targetGroup.title,
            groups: sortGroups(groups),
            entries: sortEntries(entries)
        };
    }
    return null;
}

export function getGroups(state) {
    return state[STATE_KEY].groups;
}

export function getSelectedArchive(state) {
    const id = getSelectedSourceID(state);
    const archiveManager = getSharedArchiveManager();
    return archiveManager.getSourceForID(id).vault;
}

export function getSelectedSourceName(state) {
    const selected = getSelectedSource(state);
    return (selected && selected.name) || "";
}

export function getSelectedSource(state) {
    const id = getSelectedSourceID(state);
    return state[ARCHIVES_STATE_KEY].archives.find(source => source.id === id);
}

export function getSelectedSourceID(state) {
    return state[STATE_KEY].selectedSourceID;
}

export function isCurrentlyReadOnly(state) {
    return state[STATE_KEY].readOnly;
}

export function shouldShowCreateGroupPrompt(state) {
    return state[STATE_KEY].showCreateGroupPrompt;
}

export function shouldShowGroupRenamePrompt(state) {
    return state[STATE_KEY].showGroupRenamePrompt;
}

export function sortEntries(entries) {
    const getTitle = entry => {
        const titleField = entry.fields.find(
            field => field.propertyType === "property" && field.property === "title"
        );
        return (titleField && titleField.value) || "";
    };
    return entries.sort((a, b) => {
        const aTitle = getTitle(a);
        const bTitle = getTitle(b);
        if (!aTitle) return 1;
        if (!bTitle) return -1;
        if (aTitle === bTitle) {
            return 0;
        }
        return aTitle > bTitle ? 1 : -1;
    });
}

export function sortGroups(groups) {
    return groups.sort((a, b) => {
        if (rawGroupIsTrash(b)) {
            return -1;
        } else if (rawGroupIsTrash(a)) {
            return 1;
        }
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle === bTitle) {
            return 0;
        }
        return aTitle > bTitle ? 1 : -1;
    });
}
