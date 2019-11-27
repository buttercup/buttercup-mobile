import { createAction } from "redux-actions";
import {
    ARCHIVE_CONTENTS_MARK_READONLY,
    ARCHIVE_CONTENTS_SET_GROUPS,
    ARCHIVE_CONTENTS_SET_OTP_CODES,
    ARCHIVE_CONTENTS_SET_SOURCE,
    ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT,
    ARCHIVE_CONTENTS_TOGGLE_REN_GROUP_PROMPT
} from "./types.js";

export const markCurrentSourceReadOnly = createAction(ARCHIVE_CONTENTS_MARK_READONLY);
export const setGroups = createAction(ARCHIVE_CONTENTS_SET_GROUPS);
export const setOTPCodes = createAction(ARCHIVE_CONTENTS_SET_OTP_CODES);
export const setSelectedSource = createAction(ARCHIVE_CONTENTS_SET_SOURCE);
export const showCreateGroupPrompt = createAction(ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT);
export const showGroupRenamePrompt = createAction(ARCHIVE_CONTENTS_TOGGLE_REN_GROUP_PROMPT);
