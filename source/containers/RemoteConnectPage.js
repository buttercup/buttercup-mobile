import { connect } from "react-redux";
import RemoteConnectPage from "../components/RemoteConnectPage.js";
import {
    getArchiveType,
    getRemoteConnectionInfo,
    getRemoteCredentials,
    getRemoteURL,
    isConnecting
} from "../selectors/RemoteConnectPage.js";
import { getToken, isAuthenticated as isDropboxAuthenticated } from "../selectors/dropbox.js";
import {
    isAuthenticated as isGoogleDriveAuthenticated,
    isAuthenticating as isGoogleDriveAuthenticating
} from "../selectors/googleDrive.js";
import {
    clearArchiveDetails,
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
import {
    setGoogleDriveAuthenticated,
    setGoogleDriveAuthenticating
} from "../actions/googleDrive.js";
import { authenticate as authenticateGoogleDrive } from "../library/googleDrive.js";

function handleConnectionCreation(dispatch, getState) {
    const state = getState();
    const remoteConnInfo = getRemoteConnectionInfo(state);
    const dropboxToken = getToken(state);
    return createRemoteConnection({ ...remoteConnInfo, dropboxToken })
        .then(function __onConnected() {
            const state = getState();
            let title = "Remote";
            const url = getRemoteURL(state);
            if (url) {
                const domain = getDomain(url);
                title = domain;
            } else if (dropboxToken) {
                title = "dropbox.com";
            }
            dispatch(onConnected());
            dispatch(navigateToRemoteExplorer({ title }));
        })
        .catch(function __handleError(err) {
            dispatch(disconnect());
            handleError("Connection failed", err);
        });
}

export default connect(
    (state, ownProps) => ({
        archiveType: getArchiveType(state),
        connecting: isConnecting(state),
        dropboxAuthenticated: isDropboxAuthenticated(state),
        googleDriveAuthenticated: isGoogleDriveAuthenticated(state),
        googleDriveAuthenticating: isGoogleDriveAuthenticating(state),
        url: getRemoteURL(state),
        ...getRemoteCredentials(state)
    }),
    {
        beginGoogleDriveAuth: () => dispatch => {
            dispatch(setGoogleDriveAuthenticated(false));
            dispatch(setGoogleDriveAuthenticating(true));
            authenticateGoogleDrive().catch(err => {
                handleError(err);
            });
        },
        initiateConnection: () => (...args) => handleConnectionCreation(...args),
        onChangePassword,
        onChangeURL,
        onChangeUsername,
        onConnectPressed,
        onUnmount: () => dispatch => {
            dispatch(clearArchiveDetails());
        }
    }
)(RemoteConnectPage);
