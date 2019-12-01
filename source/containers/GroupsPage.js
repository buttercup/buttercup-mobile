import { connect } from "react-redux";
import GroupsPage from "../components/GroupsPage.js";
import {
    getGroup,
    getSelectedSourceID,
    shouldShowCreateGroupPrompt,
    shouldShowGroupRenamePrompt
} from "../selectors/archiveContents.js";
import { showCreateGroupPrompt, showGroupRenamePrompt } from "../actions/archiveContents.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { getBusyState } from "../selectors/app.js";
import { createGroup, renameGroup } from "../shared/group.js";
import { updateCurrentArchive } from "../shared/archiveContents.js";
import { saveCurrentArchive } from "../shared/archive.js";
import { setBusyState } from "../actions/app.js";
import { handleError } from "../global/exceptions.js";
import { navigate, VAULT_CONTENTS_SCREEN, ENTRY_SCREEN } from "../shared/nav.js";

const getCurrentGroupID = props => {
    const navGroupID =
        (props.navigation &&
            props.navigation.state &&
            props.navigation.state.params &&
            props.navigation.state.params.groupID) ||
        null;
    return navGroupID;
};

function getGroupContents(state, props) {
    const navGroupID = getCurrentGroupID(props);
    const targetGroupID = props.groupID || navGroupID || "0";
    return getGroup(state, targetGroupID);
}

function loadAndOpenEntry(entryID, dispatch, getState) {
    const state = getState();
    const sourceID = getSelectedSourceID(state);
    const entryTitle = getEntryTitle(sourceID, entryID);
    loadEntry(sourceID, entryID);
    navigate(ENTRY_SCREEN, { title: entryTitle });
}

export default connect(
    (state, ownProps) => ({
        busyState: getBusyState(state),
        currentGroupID: getCurrentGroupID(ownProps),
        group: getGroupContents(state, ownProps),
        showGroupCreatePrompt: shouldShowCreateGroupPrompt(state),
        showGroupRenamePrompt: shouldShowGroupRenamePrompt(state)
    }),
    {
        onCancelGroupCreate: () => dispatch => {
            dispatch(showCreateGroupPrompt(false));
        },
        onCancelGroupRename: () => dispatch => {
            dispatch(showGroupRenamePrompt(false));
        },
        onEntryPress: entryID => (dispatch, getState) => {
            loadAndOpenEntry(entryID, dispatch, getState);
        },
        onGroupCreate: (parentID, groupTitle) => dispatch => {
            dispatch(showCreateGroupPrompt(false));
            dispatch(setBusyState("Saving"));
            createGroup(parentID, groupTitle);
            updateCurrentArchive();
            return saveCurrentArchive()
                .then(() => {
                    dispatch(setBusyState(null));
                })
                .catch(err => {
                    dispatch(setBusyState(null));
                    handleError("Group creation failed", err);
                });
        },
        onGroupPress: (groupID, groupTitle, isTrash) => dispatch => {
            navigate(VAULT_CONTENTS_SCREEN, { groupID, title: groupTitle, isTrash }, groupID);
        },
        onGroupRename: (groupID, groupName) => dispatch => {
            dispatch(showGroupRenamePrompt(false));
            dispatch(setBusyState("Saving"));
            renameGroup(groupID, groupName);
            updateCurrentArchive();
            return saveCurrentArchive()
                .then(() => {
                    dispatch(setBusyState(null));
                })
                .catch(err => {
                    dispatch(setBusyState(null));
                    handleError("Group rename failed", err);
                });
        }
    }
)(GroupsPage);
