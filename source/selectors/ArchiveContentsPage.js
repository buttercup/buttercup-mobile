const STATE_KEY = "archiveContents";
const ARCHIVES_STATE_KEY = "archives";

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
        foundGroup.groups :
        [];
}

export function getSelectedArchive(state) {
    const source = getSelectedSource(state);
    return source.workspace.primary.archive;
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
