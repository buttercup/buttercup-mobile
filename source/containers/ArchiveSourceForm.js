import { connect } from "react-redux";
import ArchiveSourceForm from "../components/ArchiveSourceForm.js";
import {
    getArchiveType,
    getRemoteConnectionInfo,
    getRemoteCredentials,
    getRemoteURL,
    isConnecting
} from "../selectors/ArchiveSourceForm.js";
import {
    onChangePassword,
    onChangeURL,
    onChangeUsername,
    onConnected,
    onConnectPressed
} from "../actions/ArchiveSourceForm.js";
import { createRemoteConnection } from "../library/remote.js";

function handleConnectionCreation(state) {
    return createRemoteConnection(getRemoteConnectionInfo(state))
        .then(function __onConnected() {
            onConnected();
        })
        .catch(function __handleError(err) {
            throw err; // @todo fix
        });
}

export default connect(
    (state, ownProps) => ({
        archiveType:            getArchiveType(state),
        connecting:             isConnecting(state),
        url:                    getRemoteURL(state),
        ...getRemoteCredentials(state)
    }),
    {
        initiateConnection:     () => handleConnectionCreation(state),
        onChangePassword,
        onChangeURL,
        onChangeUsername,
        onConnectPressed
    }
)(ArchiveSourceForm);
