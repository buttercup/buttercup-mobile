import { Alert } from "react-native";
import i18next from "i18next";
import { getGroup, getSelectedArchive } from "../selectors/archiveContents.js";
import { dispatch, getState } from "../store.js";
import { getTopGroupID } from "../selectors/nav.js";
import { setBusyState } from "../actions/app.js";
import { navigateBack } from "../actions/navigation.js";
import { saveCurrentArchive } from "./archive.js";
import { handleError } from "../global/exceptions.js";
import { updateCurrentArchive } from "./archiveContents.js";

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

export function promptDeleteGroup() {
    const state = getState();
    const topGroupID = getTopGroupID(state);
    const { title } = getGroup(state, topGroupID);
    Alert.alert(i18next.t("group.delete-group"), i18next.t("group.confirm-delete", { title }), [
        { text: i18next.t("cancel"), style: "cancel" },
        {
            text: i18next.t("delete"),
            style: "default",
            onPress: () => {
                dispatch(setBusyState(i18next.t("busy-state.saving")));
                Promise.resolve()
                    .then(() => deleteGroup(topGroupID))
                    .then(() => saveCurrentArchive())
                    .then(() => {
                        dispatch(setBusyState(null));
                        dispatch(navigateBack());
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
