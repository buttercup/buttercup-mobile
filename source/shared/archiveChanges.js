import { getSharedArchiveManager } from "../library/buttercup.js";
import {
    addLockedSource,
    addUnlockedSource,
    removeSourceWithID,
    setSourceLocked,
    setSourceUnlocked
} from "../actions/archives.js";

function normaliseSourceInfo(sourceInfo) {
    const archiveManager = getSharedArchiveManager();
    const sourceIndex = archiveManager.indexOfSource(sourceInfo.id);
    const source = archiveManager.sources[sourceIndex];
    const workspace = source.workspace || null;
    return {
        id: sourceInfo.id,
        name: sourceInfo.name,
        status: sourceInfo.status,
        type: sourceInfo.type,
        workspace
    };
}

export function linkArchiveManagerToStore(store) {
    const { dispatch } = store;
    const archiveManager = getSharedArchiveManager();
    // listen for new archives
    archiveManager.on("sourceAdded", function __handleNewSource(sourceInfo) {
        console.log("Source added", sourceInfo);
        const source = normaliseSourceInfo(sourceInfo);
        dispatch(addUnlockedSource(source));
    });
    archiveManager.on("sourceRehydrated", function __handleRehydratedSource(sourceInfo) {
        console.log("Source rehydrated", sourceInfo);
        const source = normaliseSourceInfo(sourceInfo);
        dispatch(addLockedSource(source));
    });
    archiveManager.on("sourceUnlocked", function __handleUnlockedSource(sourceInfo) {
        console.log("Source unlocked", sourceInfo);
        const source = normaliseSourceInfo(sourceInfo);
        dispatch(setSourceUnlocked(source));
    });
    archiveManager.on("sourceLocked", function __handleLockedSource(sourceInfo) {
        console.log("Source locked", sourceInfo);
        const source = normaliseSourceInfo(sourceInfo);
        dispatch(setSourceLocked(source));
    });
    archiveManager.on("sourceRemoved", function __handleRemovedSource(sourceInfo) {
        console.log("Source removed", sourceInfo);
        const { id } = sourceInfo;
        dispatch(removeSourceWithID(id));
    });
}
