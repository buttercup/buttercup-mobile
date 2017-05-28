import { connect } from "react-redux";
import ArchiveSourceForm from "../components/ArchiveSourceForm.js";
import {
    getArchiveType,
    getRemoteCredentials,
    getRemoteURL
} from "../selectors/ArchiveSourceForm.js";
import {
    onChangePassword,
    onChangeURL,
    onChangeUsername
} from "../actions/AddArchive.js";

export default connect(
    (state, ownProps) => ({
        archiveType:            getArchiveType(state),
        url:                    getRemoteURL(state),
        ...getRemoteCredentials(state)
    }),
    {
        onChangePassword,
        onChangeURL,
        onChangeUsername
    }
)(ArchiveSourceForm);
