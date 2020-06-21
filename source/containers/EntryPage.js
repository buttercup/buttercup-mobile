import { Alert, Clipboard, Linking } from "react-native";
import { connect } from "react-redux";
import pathOr from "ramda/es/pathOr";
import { consumeEntryFacade, createEntryFacade } from "../library/buttercupCore.js";
import i18n from "../shared/i18n";
import EntryPage from "../components/EntryPage.js";
import { handleError } from "../global/exceptions.js";
import {
    setEntryEditing,
    setEntryPropertyEdit,
    setFacadeValue,
    setViewingHidden
} from "../actions/entry.js";
import { setBusyState, setPendingOTPURL } from "../actions/app.js";
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
import { navigate, ENTRY_NEW_META_SCREEN, ENTRY_EDIT_PROPERTY_SCREEN } from "../shared/nav.js";

const isReadOnly = props => pathOr(false, ["navigation", "state", "params", "readOnly"], props);

export default connect(
    (state, ownProps) => ({
        busyState: getBusyState(state),
        editing: isEditing(state),
        isReadOnly: isCurrentlyReadOnly(state) || isReadOnly(ownProps),
        pendingOTPURL: getPendingOTPURL(state),
        properties: getEntryProperties(state),
        title: getEntryTitle(state),
        viewHidden: isViewingHidden(state)
    }),
    {
        copyToClipboard: (name, value) => () => {
            Clipboard.setString(value);
            executeNotification(
                "success",
                i18n.t("copied-value"),
                i18n.t("copied-value-description", { name })
            );
        },
        onAddProperty: ({
            initialKey = "",
            initialValue = "",
            initialValueType = null
        } = {}) => dispatch => {
            dispatch(
                setEntryPropertyEdit({
                    originalProperty: null,
                    newProperty: initialKey,
                    newValue: initialValue,
                    newValueType: initialValueType
                })
            );
            navigate(ENTRY_EDIT_PROPERTY_SCREEN);
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
        onEditField: facadeField => dispatch => {
            dispatch(
                setEntryPropertyEdit({
                    originalProperty: facadeField.property,
                    newProperty: facadeField.property,
                    newValue: facadeField.value,
                    newValueType: facadeField.valueType
                })
            );
            navigate(ENTRY_EDIT_PROPERTY_SCREEN);
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
                        text: i18n.t("ok"),
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
                    [{ text: i18n.t("ok"), onPress: () => {} }],
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
            // Check to see if the OTP URL was used
            const pendingOTPURL = getPendingOTPURL(state);
            const usedOTPURL = !!entryFacade.fields.find(
                field => field.propertyType === "property" && field.value === pendingOTPURL
            );
            dispatch(setBusyState(i18n.t("busy-state.saving")));
            return saveCurrentArchive()
                .then(() => {
                    updateCurrentArchive();
                    dispatch(setBusyState(null));
                    dispatch(setEntryEditing(false));
                    if (usedOTPURL) {
                        // clear the OTP URL
                        dispatch(setPendingOTPURL(null));
                    }
                    executeNotification(
                        "success",
                        i18n.t("entry.saved-entry"),
                        i18n.t("entry.saved-entry-description")
                    );
                })
                .catch(err => {
                    dispatch(setBusyState(null));
                    handleError(i18n.t("entry.errors.saving-failed"), err);
                });
        },
        onViewHiddenPressed: () => dispatch => {
            dispatch(setViewingHidden(true));
        }
    }
)(EntryPage);
