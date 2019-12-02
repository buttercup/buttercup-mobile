import { Alert } from "react-native";
import i18n from "../shared/i18n";
import { getGroup, getSelectedArchive } from "../selectors/archiveContents.js";
import { dispatch, getState } from "../store.js";
import { setBusyState } from "../actions/app.js";
import { saveCurrentArchive } from "./archive.js";
import { handleError } from "../global/exceptions.js";
import { updateCurrentArchive } from "./archiveContents.js";
import { navigateBack } from "./nav.js";

const TRASH_KEY = "bc_group_role";
const TRASH_ROLE = "trash";

export function createGroup(parentID, title) {
    const currentArchive = getSelectedArchive(getState());
    const parent =
        !parentID || parentID === "0" ? currentArchive : currentArchive.findGroupByID(parentID);
    parent.createGroup(title);
}

export function deleteGroup(groupID) {
    const state = getState();
    const archive = getSelectedArchive(state);
    const group = archive.findGroupByID(groupID);
    group.delete();
}

export function promptDeleteGroup(groupID) {
    const state = getState();
    const { title } = getGroup(state, groupID);
    Alert.alert(i18n.t("group.delete"), i18n.t("group.confirm-delete", { title }), [
        { text: i18n.t("cancel"), style: "cancel" },
        {
            text: i18n.t("delete"),
            style: "default",
            onPress: () => {
                dispatch(setBusyState(i18n.t("busy-state.saving")));
                Promise.resolve()
                    .then(() => deleteGroup(groupID))
                    .then(() => saveCurrentArchive())
                    .then(() => {
                        dispatch(setBusyState(null));
                        navigateBack();
                        updateCurrentArchive();
                    })
                    .catch(err => {
                        dispatch(setBusyState(null));
                        handleError("Failed deleting group", err);
                    });
            }
        }
    ]);
}

export function rawGroupIsTrash(group) {
    return group && group.attributes && group.attributes[TRASH_KEY] === TRASH_ROLE;
}

export function renameGroup(groupID, newTitle) {
    const currentArchive = getSelectedArchive(getState());
    const group = currentArchive.findGroupByID(groupID);
    group.setTitle(newTitle);
}
