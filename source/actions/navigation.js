import { createAction } from "redux-actions";
import {
    NAVIGATE_ADD_ARCHIVE,
    NAVIGATE_ARCHIVE_CONTENTS,
    NAVIGATE_BACK,
    NAVIGATE_ENTRY,
    NAVIGATE_NEW_ENTRY,
    NAVIGATE_NEW_META,
    NAVIGATE_REMOTE_CONNECT,
    NAVIGATE_REMOTE_EXPLORER
} from "./types.js";

export const navigateBack =                             createAction(NAVIGATE_BACK);
export const navigateToAddArchive =                     createAction(NAVIGATE_ADD_ARCHIVE);
export const navigateToArchiveContents =                createAction(NAVIGATE_ARCHIVE_CONTENTS);
export const navigateToEntry =                          createAction(NAVIGATE_ENTRY);
export const navigateToNewEntry =                       createAction(NAVIGATE_NEW_ENTRY);
export const navigateToNewMeta =                        createAction(NAVIGATE_NEW_META);
export const navigateToRemoteConnect =                  createAction(NAVIGATE_REMOTE_CONNECT);
export const navigateToRemoteExplorer =                 createAction(NAVIGATE_REMOTE_EXPLORER);
