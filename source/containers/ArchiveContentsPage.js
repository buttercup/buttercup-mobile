import { connect } from "react-redux";
import ArchiveContentsPage from "../components/ArchiveContentsPage.js";
import {
    getSelectedSourceName
} from "../selectors/ArchiveContentsPage.js";

export default connect(
    (state, ownProps) => ({
        title:                  getSelectedSourceName(state)
    }),
    {

    }
)(ArchiveContentsPage);
