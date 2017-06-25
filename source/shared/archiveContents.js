import { getSharedArchiveManager } from "../library/buttercup.js";
import { dispatch, getState } from "../store.js";
import { setGroups } from "../actions/ArchiveContentsPage.js";
import { getSelectedArchive } from "../selectors/ArchiveContentsPage.js";

// export function getUpdatedGroups(sourceID, parentGroupID) {
//     const archiveManager = getSharedArchiveManager();
//     const sourceIndex = archiveManager.indexOfSource(sourceID);
//     if (sourceIndex < 0) {
//         throw new Error(`Failed updating groups: No source found for ID: ${sourceID}`);
//     }
//     const source = archiveManager.sources[sourceIndex];
//     const { archive } = source.workspace.primary;
//     const parentGroup = parentGroupID === "0" ?
//         archive :
//         archive.findGroupByID(parentGroupID);
//     const groups = parentGroup.getGroups();
//     return groups.reduce((list, group) => ({
//         ...list,
//         [group.getID()]: group.getTitle()
//     }), {});
// }

export function archiveToObject(archive) {
    return archive.toObject();
}

export function removeSource(sourceID) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.remove(sourceID);
}

export function unlockSource(sourceID, password) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.unlock(sourceID, password);
}

export function updateCurrentArchive() {
    const state = getState();
    const archive = getSelectedArchive(state);
    dispatch(
        setGroups(archiveToObject(archive).groups)
    );
}
