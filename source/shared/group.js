import { Alert } from "react-native";
import { getGroup, getSelectedArchive } from "../selectors/archiveContents.js";
import { getState } from "../store.js";
import { getTopGroupID } from "../selectors/nav.js";

const TRASH_KEY = "bc_group_role";
const TRASH_ROLE = "trash";

export function createGroup(parentID, title) {
    const currentArchive = getSelectedArchive(getState());
    const parent = (!parentID || parentID === "0") ?
        currentArchive :
        currentArchive.findGroupByID(parentID);
    parent.createGroup(title);
}

export function deleteGroup(groupID) {

}

export function promptDeleteGroup() {
    const state = getState();
    const topGroupID = getTopGroupID(state);
    const { title } = getGroup(state, topGroupID);
    Alert.alert(
        "Delete Group",
        `Are you sure that you want to delete the group '${title}'?`,
        [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "default",
                onPress: () => {
                    deleteGroup(topGroupID);
                }
            }
        ]
    );
}

export function rawGroupIsTrash(group) {
    return group && group.attributes && group.attributes[TRASH_KEY] === TRASH_ROLE;
}

export function renameGroup(groupID, newTitle) {
    const currentArchive = getSelectedArchive(getState());
    const group = currentArchive.findGroupByID(groupID);
    group.setTitle(newTitle);
}
