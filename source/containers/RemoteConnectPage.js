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
    getToken as getDropboxToken,
    isAuthenticated as isDropboxAuthenticated
} from "../selectors/dropbox.js";
import {
    getAuthToken as getGoogleDriveToken,
    isAuthenticated as isGoogleDriveAuthenticated
} from "../selectors/googleDrive.js";
import { isAuthenticated as isMyButtercupAuthenticated } from "../selectors/myButtercup.js";
import { connectVault as connectMyButtercupVault } from "../library/myButtercup.js";
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
import { navigate, navigateToRoot, REMOTE_EXPLORER_SCREEN } from "../shared/nav.js";
import i18n from "../shared/i18n";
import { doAsyncWork } from "../global/async.js";

async function handleConnectionCreation(dispatch, getState, config = {}) {
    let state = getState();
    const remoteConnInfo = getRemoteConnectionInfo(state);
    const vaultType = getArchiveType(state);
    const dropboxToken = getDropboxToken(state);
    const googleDriveToken = getGoogleDriveToken(state);
    // Prep async work
    await doAsyncWork();
    if (vaultType === "mybuttercup") {
        // Skip remote explorer
        const { myButtercupPassword } = config;
        await connectMyButtercupVault(myButtercupPassword);
        navigateToRoot();
        return;
    }
    await createRemoteConnection({ ...remoteConnInfo, dropboxToken, googleDriveToken });
    // Refresh state
    state = getState();
    // Prepare explorer for next screen
    let title = i18n.t("remote.self");
    const url = getRemoteURL(state);
    if (url) {
        const domain = getDomain(url);
        title = domain;
    } else if (vaultType === "dropbox") {
        title = "Dropbox";
    } else if (vaultType === "googledrive") {
        title = "Google Drive";
    }
    dispatch(onConnected());
    navigate(REMOTE_EXPLORER_SCREEN, { title });
}

export default connect(
    (state, ownProps) => ({
        archiveType: getArchiveType(state),
        connecting: isConnecting(state),
        dropboxAuthenticated: isDropboxAuthenticated(state),
        googleDriveAuthenticated: isGoogleDriveAuthenticated(state),
        myButtercupAuthenticated: isMyButtercupAuthenticated(state),
        url: getRemoteURL(state),
        ...getRemoteCredentials(state)
    }),
    {
        initiateConnection: config => (dispatch, getState) => {
            return handleConnectionCreation(dispatch, getState, config).catch(err => {
                dispatch(disconnect());
                handleError(i18n.t("remote.errors.connection-failed"), err);
            });
        },
        onChangePassword,
        onChangeURL,
        onChangeUsername,
        onConnectPressed,
        onUnmount: () => dispatch => {
            dispatch(clearArchiveDetails());
        }
    }
)(RemoteConnectPage);
