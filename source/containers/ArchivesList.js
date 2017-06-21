import { connect } from "react-redux";
import ArchivesList from "../components/ArchivesList.js";
import {
    getArchivesDisplayList
} from "../selectors/archives.js";
import {
    setSelectedGroup,
    setSelectedSource
} from "../actions/ArchiveContentsPage.js";
import { Actions } from "react-native-router-flux";

export default connect(
    (state, ownProps) => ({
        archives:               getArchivesDisplayList(state)
    }),
    {
        selectArchiveSource:    id => dispatch => {
            dispatch(setSelectedSource(id));
            dispatch(setSelectedGroup("0"));
            // run action
            Actions.archiveContents();
        }
    }
)(ArchivesList);
