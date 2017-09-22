import { getSelectedArchive } from "../selectors/archiveContents.js";
import { getState } from "../store.js";

const TRASH_KEY = "bc_group_role";
const TRASH_ROLE = "trash";

export function rawGroupIsTrash(group) {
    return group && group.attributes && group.attributes[TRASH_KEY] === TRASH_ROLE;
}

export function renameGroup(groupID, newTitle) {
    const currentArchive = getSelectedArchive(getState());
    const group = currentArchive.findGroupByID(groupID);
    group.setTitle(newTitle);
}
