import { Clipboard } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import EntryPage from "../components/EntryPage.js";
import { setNotification } from "../actions/entry.js"
import {
    getEntryProperties,
    getEntryTitle,
    getEntryMeta,
    getNotification
} from "../selectors/entry.js";

export default connect(
    (state, ownProps) => ({
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
        }
    }
)(EntryPage);
