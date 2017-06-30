import { connect } from "react-redux";
import GroupsList from "../components/GroupsList.js";
import { getGroupsUnderID } from "../selectors/ArchiveContentsPage.js";

export default connect(
    (state, ownProps) => ({
        entries:                ownProps.entries || [],
        groups:                 ownProps.groups || getGroupsUnderID(state, ownProps.groupID),
        level:                  ownProps.level || 0
    }),
    {

    }
)(GroupsList);
