import { Clipboard } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import EntryPage from "../components/EntryPage.js";
import {
    setEntryEditing,
    setFacadeValue,
    setNotification
} from "../actions/entry.js"
import {
    getEntryFields,
    getEntryID,
    getEntryProperties,
    getEntryTitle,
    getEntryMeta,
    getNotification,
    getSourceID,
    isEditing
} from "../selectors/entry.js";
import { getEntry } from "../shared/entry.js";
import { consumeEntryFacade, createEntryFacade } from "../library/buttercup.js";
import { saveCurrentArchive } from "../shared/archive.js";

export default connect(
    (state, ownProps) => ({
        editing:                    isEditing(state),
        entryNotificationMessage:   getNotification(state),
        meta:                       getEntryMeta(state),
        properties:                 getEntryProperties(state),
        title:                      getEntryTitle(state)
    }),
    {
        copyToClipboard:            (name, value) => dispatch => {
            Clipboard.setString(value);
            dispatch(setNotification(`Copied '${name}' to clipboard...`));
            setTimeout(() => {
                // clear notification
                dispatch(setNotification(""));
            }, 1250);
        },
        onAddMeta:                  () => () => {
            Actions.addMeta();
        },
        onCancelEdit:               () => dispatch => dispatch(setEntryEditing(false)),
        onEditPressed:              () => dispatch => dispatch(setEntryEditing(true)),
        onFieldValueChange:         (field, property, value) => dispatch => {
            dispatch(setFacadeValue({
                field, property, value
            }))
        },
        onSavePressed:              () => (dispatch, getState) => {
            const state = getState();
            const fields = getEntryFields(state);
            const sourceID = getSourceID(state);
            const entryID = getEntryID(state);
            const entry = getEntry(sourceID, entryID);
            const facade = createEntryFacade(entry);
            facade.fields = fields;
            consumeEntryFacade(entry, facade);
            saveCurrentArchive();
        }
    }
)(EntryPage);
