import { createAction } from "redux-actions";
import {
    ARCHIVE_CONTENTS_SET_GROUPS,
    ARCHIVE_CONTENTS_SET_SOURCE,
    ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT
} from "./types.js";

export const setGroups =                        createAction(ARCHIVE_CONTENTS_SET_GROUPS);
export const setSelectedSource =                createAction(ARCHIVE_CONTENTS_SET_SOURCE);
export const showCreateGroupPrompt =            createAction(ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT);
