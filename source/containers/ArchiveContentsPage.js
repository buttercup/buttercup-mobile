import { connect } from "react-redux";
import ArchiveContentsPage from "../components/ArchiveContentsPage.js";
import {
    getGroups,
    getSelectedSourceName
} from "../selectors/ArchiveContentsPage.js";
// import { setSelectedSource } from "../actions/AddArchivePage.js";

export default connect(
    (state, ownProps) => ({
        groups:                 getGroups(state),
        title:                  getSelectedSourceName(state)
    }),
    {

    }
)(ArchiveContentsPage);
