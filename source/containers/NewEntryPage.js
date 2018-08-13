import { connect } from "react-redux";
import NewEntryPage from "../components/NewEntryPage.js";
import { getNewPassword, getNewTitle, getNewUsername } from "../selectors/entry.js";
import { clearNewEntry, setNewEntryProperty } from "../actions/entry.js";
import { getBusyState } from "../selectors/app.js";

export default connect(
    (state, ownProps) => ({
        busyState: getBusyState(state),
        password: getNewPassword(state),
        title: getNewTitle(state),
        username: getNewUsername(state)
    }),
    {
        onUnmount: () => dispatch => dispatch(clearNewEntry()),
        setPropertyValue: (key, value) => dispatch => dispatch(setNewEntryProperty({ key, value }))
    }
)(NewEntryPage);
