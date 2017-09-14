import { connect } from "react-redux";
import GroupsPage from "../components/GroupsPage.js";
import { getGroup } from "../selectors/ArchiveContentsPage.js";
import { navigateToEntry, navigateToGroups } from "../actions/navigation.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { getSelectedSourceID } from "../selectors/ArchiveContentsPage.js";

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
        group: getGroupContents(state, ownProps)
    }),
    {
        onEntryPress: entryID => (dispatch, getState) => {
            loadAndOpenEntry(entryID, dispatch, getState);
        },
        onGroupPress: (groupID, groupTitle) => dispatch => {
            dispatch(navigateToGroups({ id: groupID, title: `📂 ${groupTitle}` }));
        }
    }
)(GroupsPage);
