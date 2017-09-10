import { createAction } from "redux-actions";
import {
    NAVIGATE_ARCHIVE_CONTENTS,
    NAVIGATE_BACK,
    NAVIGATE_ENTRY,
    NAVIGATE_NEW_ENTRY,
    NAVIGATE_NEW_META
} from "./types.js";

export const navigateBack =                             createAction(NAVIGATE_BACK);
export const navigateToArchiveContents =                createAction(NAVIGATE_ARCHIVE_CONTENTS);
export const navigateToEntry =                          createAction(NAVIGATE_ENTRY);
export const navigateToNewEntry =                       createAction(NAVIGATE_NEW_ENTRY);
export const navigateToNewMeta =                        createAction(NAVIGATE_NEW_META);
