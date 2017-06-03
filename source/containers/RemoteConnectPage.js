import { connect } from "react-redux";
import RemoteConnectPage from "../components/RemoteConnectPage.js";
import {
    getArchiveType,
    getRemoteConnectionInfo,
    getRemoteCredentials,
    getRemoteURL,
    isConnecting
} from "../selectors/RemoteConnectPage.js";
import {
    onChangePassword,
    onChangeURL,
    onChangeUsername,
    onConnected,
    onConnectPressed
} from "../actions/RemoteConnectPage.js";
import { createRemoteConnection } from "../shared/explorerConnection.js";
import { Actions } from "react-native-router-flux";

function handleConnectionCreation(dispatch, getState) {
    return createRemoteConnection(getRemoteConnectionInfo(getState()))
        .then(function __onConnected() {
            dispatch(onConnected());
            Actions.remoteExplorer();
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
)(RemoteConnectPage);
