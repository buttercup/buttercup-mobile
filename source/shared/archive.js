import { getState } from "../store.js";
import i18n from "../shared/i18n";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { doAsyncWork } from "../global/async.js";

export function getNameForSource(sourceID) {
    const source = getSharedArchiveManager().getSourceForID(sourceID);
    if (!source) {
        throw new Error(i18n.t("vaults.errors.unable-to-fetch-source", { sourceID }));
    }
    return source.name;
}

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
