import { Alert, Clipboard, Linking } from "react-native";
import { connect } from "react-redux";
import i18n from "../shared/i18n";
import EntryPage from "../components/EntryPage.js";
import { handleError } from "../global/exceptions.js";
import { setEntryEditing, setFacadeValue, setViewingHidden } from "../actions/entry.js";
import { navigateBack, navigateToNewMeta } from "../actions/navigation.js";
import { setBusyState } from "../actions/app.js";
import {
    getEntryFields,
    getEntryID,
    getEntryPassword,
    getEntryProperties,
    getEntryTitle,
    getEntryURL,
    getNotification,
    getSourceID,
    isEditing,
    isViewingHidden
} from "../selectors/entry.js";
import { isCurrentlyReadOnly } from "../selectors/archiveContents.js";
import { getBusyState } from "../selectors/app.js";
import { getEntry, loadEntry } from "../shared/entry.js";
import { consumeEntryFacade, createEntryFacade } from "../library/buttercup.js";
import { saveCurrentArchive } from "../shared/archive.js";
import { updateCurrentArchive } from "../shared/archiveContents.js";
import { promptDeleteEntry } from "../shared/entry.js";
import { executeNotification } from "../global/notify.js";
import { prepareURLForLaunch } from "../library/helpers.js";

export default connect(
    (state, ownProps) => ({
        busyState: getBusyState(state),
        editing: isEditing(state),
        isReadOnly: isCurrentlyReadOnly(state),
        properties: getEntryProperties(state),
        title: getEntryTitle(state),
        viewHidden: isViewingHidden(state)
    }),
    {
        copyToClipboard: (name, value) => dispatch => {
            Clipboard.setString(value);
            executeNotification("success", "Copied value", `Copied '${name}' to clipboard`);
        },
        onAddMeta: () => dispatch => {
            dispatch(navigateToNewMeta());
        },
        onCancelEdit: () => (dispatch, getState) => {
            const state = getState();
            const sourceID = getSourceID(state);
            const entryID = getEntryID(state);
            dispatch(setEntryEditing(false));
            loadEntry(sourceID, entryID);
        },
        onCancelViewingHidden: () => dispatch => {
            dispatch(setViewingHidden(false));
        },
        onDeletePressed: () => () => {
            promptDeleteEntry();
        },
        onEditPressed: () => dispatch => dispatch(setEntryEditing(true)),
        onFieldValueChange: (field, property, value) => dispatch => {
            dispatch(
                setFacadeValue({
                    field,
                    property,
                    value
                })
            );
        },
        onOpenPressed: () => (dispatch, getState) => {
            const state = getState();
            const url = getEntryURL(state);
            const password = getEntryPassword(state);
            if (url) {
                Alert.alert(i18n.t("entry.open-url"), i18n.t("entry.open-url-description"), [
                    { text: i18n.t("cancel"), style: "cancel" },
                    {
                        text: i18n.t("entry.ok"),
                        style: "default",
                        onPress: () => {
                            Clipboard.setString(password);
                            Linking.openURL(prepareURLForLaunch(url));
                        }
                    }
                ]);
            } else {
                Alert.alert(
                    i18n.t("entry.no-url"),
                    i18n.t("entry.no-url-description"),
                    [{ text: i18n.t("entry.ok"), onPress: () => {} }],
                    { cancelable: false }
                );
            }
        },
        onSavePressed: () => (dispatch, getState) => {
            const state = getState();
            const fields = getEntryFields(state);
            const sourceID = getSourceID(state);
            const entryID = getEntryID(state);
            const entry = getEntry(sourceID, entryID);
            const facade = createEntryFacade(entry);
            facade.fields = fields;
            consumeEntryFacade(entry, facade);
            dispatch(setBusyState(i18n.t("busy-state.saving")));
            return saveCurrentArchive()
                .then(() => {
                    updateCurrentArchive();
                    dispatch(setBusyState(null));
                    dispatch(setEntryEditing(false));
                    executeNotification(
                        "success",
                        i18n.t("entry.saved-entry"),
                        i18n.t("entry.saved-entry-description")
                    );
                })
                .catch(err => {
                    dispatch(setBusyState(null));
                    handleError("Saving failed", err);
                });
        },
        onViewHiddenPressed: () => dispatch => {
            dispatch(setViewingHidden(true));
        }
    }
)(EntryPage);
