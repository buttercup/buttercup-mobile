import { connect } from "react-redux";
import GroupsPage from "../components/GroupsPage.js";
import { getGroup } from "../selectors/ArchiveContentsPage.js";
import { navigateToGroups } from "../actions/navigation.js";
// import { getNewMetaKey, getNewMetaValue } from "../selectors/entry.js";
// import { clearNewMeta, setNewMeta } from "../actions/entry.js";

function getGroupContents(state, props) {
    const navGroupID = props.navigation && props.navigation.state && props.navigation.state.params &&
        props.navigation.state.params.groupID || null;
    const targetGroupID = props.groupID || navGroupID || "0";
    return getGroup(state, targetGroupID);
}

export default connect(
    (state, ownProps) => ({
        group: getGroupContents(state, ownProps)
    }),
    {
        onGroupPress: (groupID, groupTitle) => dispatch => {
            dispatch(navigateToGroups({ id: groupID, title: `📂 ${groupTitle}` }));
        }
    }
)(GroupsPage);
