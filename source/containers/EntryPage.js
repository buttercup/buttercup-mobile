import { Alert, Clipboard, Linking } from "react-native";
import { connect } from "react-redux";
import { consumeEntryFacade, createEntryFacade } from "@buttercup/facades";
import EntryPage from "../components/EntryPage.js";
import { handleError } from "../global/exceptions.js";
import { setEntryEditing, setFacadeValue, setViewingHidden } from "../actions/entry.js";
import { navigateBack, navigateToNewMeta } from "../actions/navigation.js";
import { setBusyState } from "../actions/app.js";
import {
    getEntryFacade,
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
import { getBusyState, getPendingOTPURL } from "../selectors/app.js";
import { getEntry, loadEntry } from "../shared/entry.js";
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
        pendingOTPURL: getPendingOTPURL(state),
        properties: getEntryProperties(state),
        title: getEntryTitle(state),
        viewHidden: isViewingHidden(state)
    }),
    {
        copyToClipboard: (name, value) => () => {
            Clipboard.setString(value);
            executeNotification("success", "Copied value", `Copied '${name}' to clipboard`);
        },
        onAddMeta: ({ initialKey = "", initialValue = "" } = {}) => dispatch => {
            dispatch(
                navigateToNewMeta({
                    initialKey,
                    initialValue
                })
            );
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
                Alert.alert(
                    "Open URL",
                    "Press OK to launch the URL. The password will be copied to the clipboard.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "OK",
                            style: "default",
                            onPress: () => {
                                Clipboard.setString(password);
                                Linking.openURL(prepareURLForLaunch(url));
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "No URL",
                    "This entry doesn't contain a URL meta field."[
                        { text: "OK", onPress: () => {} }
                    ],
                    { cancelable: false }
                );
            }
        },
        onSavePressed: () => (dispatch, getState) => {
            const state = getState();
            const entryFacade = getEntryFacade(state);
            const sourceID = getSourceID(state);
            const entryID = getEntryID(state);
            const entry = getEntry(sourceID, entryID);
            consumeEntryFacade(entry, entryFacade);
            dispatch(setBusyState("Saving"));
            return saveCurrentArchive()
                .then(() => {
                    updateCurrentArchive();
                    dispatch(setBusyState(null));
                    dispatch(setEntryEditing(false));
                    executeNotification(
                        "success",
                        "Saved entry",
                        "Successfully saved changes to the entry"
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
