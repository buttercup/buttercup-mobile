import { createAction } from "redux-actions";
import {
    // ARCHIVE_CONTENTS_SET_CHILD_GROUPS,
    // ARCHIVE_CONTENTS_SET_GROUP,
    ARCHIVE_CONTENTS_SET_GROUPS,
    ARCHIVE_CONTENTS_SET_SOURCE,
} from "./types.js";

// export const setChildGroups =                   createAction(ARCHIVE_CONTENTS_SET_CHILD_GROUPS);
// export const setSelectedGroup =                 createAction(ARCHIVE_CONTENTS_SET_GROUP);
export const setGroups =                        createAction(ARCHIVE_CONTENTS_SET_GROUPS);
export const setSelectedSource =                createAction(ARCHIVE_CONTENTS_SET_SOURCE);
