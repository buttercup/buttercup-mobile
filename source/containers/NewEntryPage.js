import { connect } from "react-redux";
import NewEntryPage from "../components/NewEntryPage.js";
import {
    getNewPassword,
    getNewTitle,
    getNewUsername
} from "../selectors/entry.js";
import { setNewEntryProperty } from "../actions/entry.js";
import { isSaving } from "../selectors/app.js";

export default connect(
    (state, ownProps) => ({
        isSaving:               isSaving(state),
        password:               getNewPassword(state),
        title:                  getNewTitle(state),
        username:               getNewUsername(state)
    }),
    {
        setPropertyValue:       (key, value) => dispatch => dispatch(setNewEntryProperty({ key, value }))
    }
)(NewEntryPage);
