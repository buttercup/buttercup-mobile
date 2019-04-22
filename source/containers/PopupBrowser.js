import { connect } from "react-redux";
import PopupBrowser from "../components/PopupBrowser.js";
import { getURL } from "../selectors/browser.js";
import {
    setDropboxAuthenticated,
    setDropboxAuthenticating,
    setDropboxAuthToken
} from "../actions/dropbox.js";
import { navigateBack } from "../actions/navigation.js";
import { executeNotification } from "../global/notify.js";

export default connect(
    (state, ownProps) => ({
        url: getURL(state)
    }),
    {
        onClose: () => dispatch => {
            dispatch(setDropboxAuthenticated(false));
            dispatch(setDropboxAuthenticating(false));
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
        }
    }
)(PopupBrowser);
