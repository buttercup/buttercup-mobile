import { getState } from "../store.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { doAsyncWork } from "../global/async.js";

export function saveCurrentArchive(sourceOverride) {
    let source;
    if (sourceOverride) {
        source = sourceOverride;
    } else {
        const state = getState();
        const sourceID = getSelectedSourceID(state);
        source = getSharedArchiveManager().getSourceForID(sourceID);
    }
    return source.save().then(doAsyncWork);
}
