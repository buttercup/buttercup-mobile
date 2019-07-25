import { connect } from "react-redux";
import PopupBrowser from "../components/PopupBrowser.js";
import { getURL } from "../selectors/browser.js";
import {
    setDropboxAuthenticated,
    setDropboxAuthenticating,
    setDropboxAuthToken
} from "../actions/dropbox.js";
import { setGoogleDriveAuthCode } from "../actions/googleDrive.js";
import { navigateBack } from "../actions/navigation.js";
import { executeNotification } from "../global/notify.js";

export default connect(
    (state, ownProps) => ({
        url: getURL(state)
    }),
    {
        onClearToken: () => dispatch => {
            dispatch(setDropboxAuthenticated(false));
            dispatch(setDropboxAuthenticating(false));
            dispatch(setGoogleDriveAuthenticated(false));
            dispatch(setGoogleDriveAuthenticating(false));
        },
        onDropboxTokenReceived: token => dispatch => {
            dispatch(setDropboxAuthToken(token));
            dispatch(setDropboxAuthenticated(true));
            dispatch(setDropboxAuthenticating(false));
            dispatch(navigateBack());
            executeNotification(
                "success",
                "Dropbox authentication",
                "Successfully authenticated Dropbox account"
            );
        },
        onGoogleDriveAuthCodeReceived: authCode => dispatch => {
            dispatch(setGoogleDriveAuthCode(authCode));
            dispatch(navigateBack());
            executeNotification(
                "success",
                "Google Drive authentication",
                "Successfully authenticated Google Drive account"
            );
        }
    }
)(PopupBrowser);
