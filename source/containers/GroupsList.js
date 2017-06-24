import { connect } from "react-redux";
import GroupsList from "../components/GroupsList.js";
import { getGroupsUnderID } from "../selectors/ArchiveContentsPage.js";
// import {
//     getArchivesDisplayList,
//     isUnlocking,
//     shouldShowUnlockPasswordPrompt
// } from "../selectors/archives.js";
// import {
//     setIsUnlocking,
//     showUnlockPasswordPrompt
// } from "../actions/archives.js";

export default connect(
    (state, ownProps) => ({
        groups:                 getGroupsUnderID(state, ownProps.groupID)
    }),
    {

    }
)(GroupsList);
