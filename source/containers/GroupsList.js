import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import GroupsList from "../components/GroupsList.js";
import { getGroupsUnderID, getSelectedSourceID } from "../selectors/ArchiveContentsPage.js";
import { loadEntry } from "../shared/archiveContents.js";

function loadAndOpenEntry(entryID, dispatch, getState) {
    const state = getState();
    loadEntry(getSelectedSourceID(state), entryID);
    Actions.entry();
}

export default connect(
    (state, ownProps) => ({
        entries:                ownProps.entries || [],
        groups:                 ownProps.groups || getGroupsUnderID(state, ownProps.groupID),
        level:                  ownProps.level || 0
    }),
    {
        loadEntry:              (entryID) => (dispatch, getState) => loadAndOpenEntry(entryID, dispatch, getState)

    }
)(GroupsList);
