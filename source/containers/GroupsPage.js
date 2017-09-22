import { connect } from "react-redux";
import GroupsPage from "../components/GroupsPage.js";
import { getGroup, shouldShowCreateGroupPrompt, shouldShowGroupRenamePrompt } from "../selectors/archiveContents.js";
import { navigateToEntry, navigateToGroups } from "../actions/navigation.js";
import { showCreateGroupPrompt, showGroupRenamePrompt } from "../actions/archiveContents.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { isSaving } from "../selectors/app.js";
import { getTopGroupID } from "../selectors/nav.js";
import { createGroup, renameGroup } from "../shared/group.js";
import { updateCurrentArchive } from "../shared/archiveContents.js";
import { saveCurrentArchive } from "../shared/archive.js";
import { setSaving } from "../actions/app.js";
import { handleError } from "../global/exceptions.js";

function getGroupContents(state, props) {
    const navGroupID = props.navigation && props.navigation.state && props.navigation.state.params &&
        props.navigation.state.params.groupID || null;
    const targetGroupID = props.groupID || navGroupID || "0";
    return getGroup(state, targetGroupID);
}

function loadAndOpenEntry(entryID, dispatch, getState) {
    const state = getState();
    const sourceID = getSelectedSourceID(state);
    const entryTitle = getEntryTitle(sourceID, entryID);
    loadEntry(sourceID, entryID);
    dispatch(navigateToEntry({ title: entryTitle }));
}

export default connect(
    (state, ownProps) => ({
        currentGroupID: getTopGroupID(state) || "0",
        group: getGroupContents(state, ownProps),
        saving: isSaving(state),
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
            dispatch(setSaving(true));
            createGroup(parentID, groupTitle);
            updateCurrentArchive();
            return saveCurrentArchive()
                .then(() => {
                    dispatch(setSaving(false));
                })
                .catch(err => {
                    dispatch(setSaving(false));
                    handleError("Group creation failed", err);
                });
        },
        onGroupPress: (groupID, groupTitle, isTrash) => dispatch => {
            dispatch(navigateToGroups({ id: groupID, title: groupTitle, isTrash }));
        },
        onGroupRename: (groupID, groupName) => dispatch => {
            dispatch(showGroupRenamePrompt(false));
            dispatch(setSaving(true));
            renameGroup(groupID, groupName);
            updateCurrentArchive();
            return saveCurrentArchive()
                .then(() => {
                    dispatch(setSaving(false));
                })
                .catch(err => {
                    dispatch(setSaving(false));
                    handleError("Group rename failed", err);
                });
        }
    }
)(GroupsPage);
