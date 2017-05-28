import { connect } from "react-redux";
import ArchiveSourceForm from "../components/ArchiveSourceForm.js";
import {
    getArchiveType
} from "../selectors/ArchiveSourceForm.js";
// import { onArchiveTypeSelected } from "../actions/AddArchive.js";

export default connect(
    (state, ownProps) => ({
        archiveType:            getArchiveType(state)
    }),
    {

    }
)(ArchiveSourceForm);
