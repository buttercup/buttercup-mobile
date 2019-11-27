import { connect } from "react-redux";
import CodesPage from "../components/CodesPage.js";
// import {
//     getGroup,
//     shouldShowCreateGroupPrompt,
//     shouldShowGroupRenamePrompt
// } from "../selectors/archiveContents.js";
// import { navigateToEntry, navigateToGroups } from "../actions/navigation.js";
// import { showCreateGroupPrompt, showGroupRenamePrompt } from "../actions/archiveContents.js";
// import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { getOTPCodes } from "../selectors/archiveContents.js";
// import { getBusyState } from "../selectors/app.js";
// import { getTopGroupID } from "../selectors/nav.js";
// import { createGroup, renameGroup } from "../shared/group.js";
// import { updateCurrentArchive } from "../shared/archiveContents.js";
// import { saveCurrentArchive } from "../shared/archive.js";
// import { setBusyState } from "../actions/app.js";
// import { handleError } from "../global/exceptions.js";

// function getGroupContents(state, props) {
//     const navGroupID =
//         (props.navigation &&
//             props.navigation.state &&
//             props.navigation.state.params &&
//             props.navigation.state.params.groupID) ||
//         null;
//     const targetGroupID = props.groupID || navGroupID || "0";
//     return getGroup(state, targetGroupID);
// }

// function loadAndOpenEntry(entryID, dispatch, getState) {
//     const state = getState();
//     const sourceID = getSelectedSourceID(state);
//     const entryTitle = getEntryTitle(sourceID, entryID);
//     loadEntry(sourceID, entryID);
//     dispatch(navigateToEntry({ title: entryTitle }));
// }

export default connect(
    (state, ownProps) => ({
        otpCodes: getOTPCodes(state)
        // busyState: getBusyState(state),
        // currentGroupID: getTopGroupID(state) || "0",
        // group: getGroupContents(state, ownProps),
        // showGroupCreatePrompt: shouldShowCreateGroupPrompt(state),
        // showGroupRenamePrompt: shouldShowGroupRenamePrompt(state)
    }),
    {
        // onCancelGroupCreate: () => dispatch => {
        //     dispatch(showCreateGroupPrompt(false));
        // }
    }
)(CodesPage);
