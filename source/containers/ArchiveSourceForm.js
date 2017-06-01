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

function handleConnectionCreation(dispatch, getState) {
    return createRemoteConnection(getRemoteConnectionInfo(getState()))
        .then(function __onConnected() {
            dispatch(onConnected());
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
        initiateConnection:     () => (...args) => handleConnectionCreation(...args),
        onChangePassword,
        onChangeURL,
        onChangeUsername,
        onConnectPressed
    }
)(ArchiveSourceForm);
