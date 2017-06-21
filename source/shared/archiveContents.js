import { getSharedArchiveManager } from "../library/buttercup.js";

export function getUpdatedGroups(sourceID, parentGroupID) {
    const archiveManager = getSharedArchiveManager();
    const sourceIndex = archiveManager.indexOfSource(sourceID);
    if (sourceIndex < 0) {
        throw new Error(`Failed updating groups: No source found for ID: ${sourceID}`);
    }
    const source = archiveManager.sources[sourceIndex];
    const { archive } = source.workspace.primary;
    const parentGroup = parentGroupID === "0" ?
        archive :
        archive.findGroupByID(parentGroupID);
    const groups = parentGroup.getGroups();
    return groups.reduce((list, group) => ({
        ...list,
        [group.getID()]: group.getTitle()
    }), {});
    // return groups.map(group => ({
    //     title: group.getTitle(),
    //     id: group.getID()
    // }));
}
