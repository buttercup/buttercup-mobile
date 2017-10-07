import { createAction } from "redux-actions";
import {
    NAVIGATE_ADD_ARCHIVE,
    NAVIGATE_BACK,
    NAVIGATE_ENTRY,
    NAVIGATE_GROUPS,
    NAVIGATE_LOCK_PAGE,
    NAVIGATE_NEW_ENTRY,
    NAVIGATE_NEW_META,
    NAVIGATE_POPUP_BROWSER,
    NAVIGATE_REMOTE_CONNECT,
    NAVIGATE_REMOTE_EXPLORER,
    NAVIGATE_ROOT
} from "./types.js";

export const navigateBack =                             createAction(NAVIGATE_BACK);
export const navigateToAddArchive =                     createAction(NAVIGATE_ADD_ARCHIVE);
export const navigateToEntry =                          createAction(NAVIGATE_ENTRY);
export const navigateToGroups =                         createAction(NAVIGATE_GROUPS);
export const navigateToLockPage =                       createAction(NAVIGATE_LOCK_PAGE);
export const navigateToNewEntry =                       createAction(NAVIGATE_NEW_ENTRY);
export const navigateToNewMeta =                        createAction(NAVIGATE_NEW_META);
export const navigateToPopupBrowser =                   createAction(NAVIGATE_POPUP_BROWSER);
export const navigateToRemoteConnect =                  createAction(NAVIGATE_REMOTE_CONNECT);
export const navigateToRemoteExplorer =                 createAction(NAVIGATE_REMOTE_EXPLORER);
export const navigateToRoot =                           createAction(NAVIGATE_ROOT);
