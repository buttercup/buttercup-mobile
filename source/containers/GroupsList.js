import { connect } from "react-redux";
import GroupsList from "../components/GroupsList.js";
import { getGroupsUnderID, getSelectedSourceID } from "../selectors/ArchiveContentsPage.js";
import { loadEntry } from "../shared/archiveContents.js";

export default connect(
    (state, ownProps) => ({
        entries:                ownProps.entries || [],
        groups:                 ownProps.groups || getGroupsUnderID(state, ownProps.groupID),
        level:                  ownProps.level || 0
    }),
    {
        loadEntry:              (entryID) => (dispatch, getState) =>
                                    loadEntry(getSelectedSourceID(getState()), entryID)
    }
)(GroupsList);
