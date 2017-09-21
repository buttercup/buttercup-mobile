import { getSharedArchiveManager } from "../library/buttercup.js";
import { rawGroupIsTrash } from "../shared/group.js";

const STATE_KEY = "archiveContents";
const ARCHIVES_STATE_KEY = "archives";

export function getGroup(state, id, _groups = null) {
    const groups = _groups || getGroups(state);
    if (id === "0") {
        return {
            id: "0",
            title: "[archive]",
            groups: sortGroups(groups),
            entries: []
        };
    }
    const targetGroup = groups.find(group => group.id === id);
    if (targetGroup) {
        return {
            id,
            title: targetGroup.title,
            groups: sortGroups(targetGroup.groups) || [],
            entries: sortEntries(targetGroup.entries) || []
        };
    }
    for (let i, groupCount = groups.length; i < groupCount; i += 1) {
        const foundGroup = getGroup(state, id, groups[i].groups || []);
        if (foundGroup) {
            return {
                id,
                title: foundGroup.title,
                groups: sortGroups(foundGroup.groups) || [],
                entries: sortEntries(foundGroup.entries) || []
            };
        }
    }
    return null;
}

export function getGroups(state) {
    return state[STATE_KEY].groups;
}

export function getGroupsUnderID(state, id) {
    const groups = getGroups(state);
    const findGroup = groups => {
        let foundGroup = groups.find(group => group.id === id) || null;
        if (!foundGroup) {
            for (let i = 0, groupsLen = groups.length; i < groupsLen; i += 1) {
                foundGroup = findGroup(groups[i].groups || []) || null;
                if (foundGroup !== null) {
                    break;
                }
            }
        }
        return foundGroup;
    };
    const foundGroup = id.toString() === "0" ?
        { groups } :
        findGroup(groups);
    return foundGroup && foundGroup.groups ?
        sortGroups(foundGroup.groups) :
        [];
}

export function getSelectedArchive(state) {
    const id = getSelectedSourceID(state);
    const archiveManager = getSharedArchiveManager();
    return archiveManager.sources[archiveManager.indexOfSource(id)].workspace.primary.archive;
}

export function getSelectedSourceName(state) {
    const selected = getSelectedSource(state);
    return selected && selected.name || "";
}

export function getSelectedSource(state) {
    const id = getSelectedSourceID(state);
    return state[ARCHIVES_STATE_KEY].archives.find(source => source.id === id);
}

export function getSelectedSourceID(state) {
    return state[STATE_KEY].selectedSourceID;
}

export function sortEntries(entries) {
    return entries.sort((a, b) => {
        const aTitle = a.properties.title.toLowerCase();
        const bTitle = b.properties.title.toLowerCase();
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
