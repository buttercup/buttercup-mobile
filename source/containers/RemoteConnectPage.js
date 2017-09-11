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
    disconnect,
    onChangePassword,
    onChangeURL,
    onChangeUsername,
    onConnected,
    onConnectPressed
} from "../actions/RemoteConnectPage.js";
import { createRemoteConnection } from "../shared/explorerConnection.js";
import { handleError } from "../global/exceptions.js";
import { getDomain } from "../library/helpers.js";
import { navigateToRemoteExplorer } from "../actions/navigation.js";

function handleConnectionCreation(dispatch, getState) {
    return createRemoteConnection(getRemoteConnectionInfo(getState()))
        .then(function __onConnected() {
            const state = getState();
            const url = getRemoteURL(state);
            const domain = getDomain(url);
            dispatch(onConnected());
            dispatch(navigateToRemoteExplorer({ title: domain }));
        })
        .catch(function __handleError(err) {
            dispatch(disconnect());
            handleError("Connection failed", err);
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
